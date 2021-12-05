import Vector2 from './Vector2';

export default class AABB {
  constructor({min, max}) {
    this.min = new Vector2(min);
    this.max = new Vector2(max);
  }

  size() {
    return this.max.clone().sub(this.min);
  }

  static fromRect({position, size}) {
    return new AABB({
      min: position,
      max: new Vector2(position).add(size),
    });
  }
}
