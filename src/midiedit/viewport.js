import React from 'react';

import Vector2 from './Vector2';
import AABB from './AABB';
import {getMouseEventPos} from './mouseUtils';
import {clamp} from './mathUtils';

import {Behavior} from './behavior';

const {useMemo, useState} = React;

const SELECT_MAX_MOVE_DISTANCE = 5;

export function zoomAtPoint(
  {zoom: prevZoom, pan: prevPan},
  pointInView,
  updatedZoom
) {
  // find where the point is in (unzoomed) world coords
  const pointWorld = pointInView.clone().div(prevZoom).add(prevPan);
  // find point (zoomed) coords at new zoom, subtract point viewport offset
  // to get viewport offset (zoomed coords), then unzoom to get global pan
  const updatedPan = pointWorld
    .clone()
    .mul(updatedZoom)
    .sub(pointInView)
    .div(updatedZoom);

  return {
    zoom: updatedZoom,
    pan: updatedPan,
  };
}

export class DragPanBehavior extends Behavior {
  isMouseDown = false;
  panAtDragStart = new Vector2();
  currentPan = new Vector2();
  startMousePos = new Vector2();

  onmousedown = (e) => {
    this.isMouseDown = true;

    this.panAtDragStart.copyFrom(this.props.viewportState.pan);
    this.startMousePos.copyFrom(getMouseEventPos(e, this.canvas));
  };

  onmouseup = (e) => {
    this.isMouseDown = false;
    this.controller.releaseLock('drag', this);
  };

  onmousemove = (e) => {
    if (this.isMouseDown && !this.hasLock('drag')) {
      const distanceMoved = getMouseEventPos(e, this.canvas).distanceTo(
        this.startMousePos
      );
      if (distanceMoved > SELECT_MAX_MOVE_DISTANCE) {
        // now we know for sure we're dragging
        this.controller.acquireLock('drag', this, this.priority);
      }
    }

    if (this.hasLock('drag')) {
      const movementSinceStart = getMouseEventPos(e, this.canvas).sub(
        this.startMousePos
      );

      this.props.setViewportState?.((s) => {
        // pan is in world (unzoomed) coords so we must scale our translations
        const translation = movementSinceStart.clone().div(s.zoom).mul({
          x: -1,
          y: -1,
        });
        return {
          ...s,
          pan: translation.add(this.panAtDragStart),
          // pan: s.pan.clone().mul(s.zoom).sub(movement).div(s.zoom),
        };
      });
    }
  };

  onEnabled() {
    this.isMouseDown = false;
  }

  getEventHandlers() {
    return {
      mousemove: this.onmousemove,
      mouseup: this.onmouseup,
      mousedown: this.onmousedown,
    };
  }
}

export class WheelScrollBehavior extends Behavior {
  onwheel = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let deltaY = e.deltaY;
    // is zoom in pixels or lines?
    if (e.deltaMode > 0) deltaY *= 100;
    let deltaX = e.deltaX;

    this.props.setViewportState?.((s) => {
      return {
        ...s,
        pan: s.pan.clone().add(new Vector2({x: deltaX, y: deltaY}).div(s.zoom)),
      };
    });
  };

  getEventHandlers() {
    return {
      wheel: this.onwheel,
    };
  }
}

export class WheelZoomBehavior extends Behavior {
  onwheel = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // zoom centered on mouse
    const mousePosInView = getMouseEventPos(e, this.canvas);

    let deltaY = e.deltaY;
    // is zoom in pixels or lines?
    if (e.deltaMode > 0) deltaY *= 100;

    // this is just manually tuned, it relates to the scale of mousewheel movement values
    const zoomSpeed = 0.005;

    const zoomScaleFactor = 1 + zoomSpeed * -deltaY;

    this.props.setViewportState?.((s) => {
      const updatedZoom = s.zoom
        .clone()
        .mul({x: zoomScaleFactor, y: zoomScaleFactor});
      const updated = zoomInAtPointClamped(
        s,
        mousePosInView,
        updatedZoom,
        this.props.minZoom,
        this.props.maxZoom
      );

      if (this.props?.dimensions?.x !== true) {
        updated.zoom.x = s.zoom.x;
        updated.pan.x = s.pan.x;
      }
      if (this.props?.dimensions?.y !== true) {
        updated.zoom.y = s.zoom.y;
        updated.pan.y = s.pan.y;
      }

      return {
        ...s,
        ...updated,
      };
    });
  };

  getEventHandlers() {
    return {
      wheel: this.onwheel,
    };
  }
}

export function zoomInAtPointClamped(
  viewportState,
  pointInView,
  updatedZoom,
  minZoom = new Vector2({x: 0, y: 0}),
  maxZoom = new Vector2({x: Infinity, y: Infinity})
) {
  const updatedZoomClamped = new Vector2({
    x: clamp(updatedZoom.x, minZoom.x, maxZoom.x),
    y: clamp(updatedZoom.y, minZoom.y, maxZoom.y),
  });

  return zoomAtPoint(viewportState, pointInView, updatedZoomClamped);
}

export function makeViewportState() {
  return {
    // zoom represents the magnification factor eg. zoom: 2 will draw at 2x size
    // (so a rect would have 2x dimensions in pixels, for example).
    zoom: new Vector2({x: 1, y: 1}),
    // pan represents the offset to the view at 1x zoom
    // when adjusting the pan you need to take the zoom into account
    pan: new Vector2(),
  };
}

export function makeViewportStateFromExtents(extents, viewportDimensions) {
  const viewportDimensionsVec = new Vector2({
    x: viewportDimensions.width,
    y: viewportDimensions.height,
  });
  const aabb = new AABB(extents);
  // 1/size gives zoom level to exactly contain that size
  const zoom = viewportDimensionsVec.div(aabb.size());
  const pan = new Vector2(extents.min);

  return {zoom, pan};
}

export const ViewportStateSerializer = {
  stringify(state) {
    return JSON.stringify(state);
  },
  parse(json) {
    const data = JSON.parse(json);
    if (!data) return null;
    return {
      zoom: new Vector2(data.zoom),
      pan: new Vector2(data.pan),
    };
  },
};

export function useViewportState() {
  return useState(makeViewportState);
}

// converts between 'world' (unzoomed/panned) and 'screen' (panned and zoomed) coords
export class ViewportTransformer {
  constructor({zoom, pan}) {
    this.zoom = zoom;
    this.pan = pan;
  }
  sizeToScreen(size) {
    // just scale
    return new Vector2(size).mul(this.zoom);
  }
  sizeFromScreen(screenSize) {
    return new Vector2(screenSize).div(this.zoom);
  }
  sizeXFromScreen(screenSizeX) {
    return screenSizeX / this.zoom.x;
  }
  sizeYFromScreen(screenSizeY) {
    return screenSizeY / this.zoom.y;
  }
  positionToScreen(position) {
    // translate then scale as pan is in world (unthis.zoomed) coords
    return new Vector2(position).sub(this.pan).mul(this.zoom);
  }
  positionFromScreen(screenPos) {
    return new Vector2(screenPos).div(this.zoom).add(this.pan);
  }
}

export function useViewport({zoom, pan}) {
  return useMemo(() => new ViewportTransformer({zoom, pan}), [zoom, pan]);
}
