import * as Tonal from '@tonaljs/tonal';
import * as Note from '@tonaljs/note';

// convert flats and multiple sharps to natural or sharp form
export default function simplifyEnharmonics(noteName) {
  const noteNameSimplified = Note.simplify(noteName);
  if (Tonal.note(noteNameSimplified).acc === 'b') {
    return Note.enharmonic(noteNameSimplified);
  }

  return noteNameSimplified;
}
