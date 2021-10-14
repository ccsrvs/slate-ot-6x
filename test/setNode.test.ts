import { xTransformMxN } from '../src/SlateType';
import { initialDoc, makeOp, applyOp } from './utils';
import * as _ from 'lodash';

describe('left side to setNode, right side to:', () => {
  let doc1, doc2;
  let op1, op2;

  beforeEach(() => {
    doc1 = _.cloneDeep(initialDoc);
    doc2 = _.cloneDeep(initialDoc);
  });

  afterEach(() => {
    const [op12, op21] = xTransformMxN([op1], [op2], "left");

    let doc1snapshot = applyOp(doc1, op1);
    doc1 = applyOp(doc1snapshot, op21);
    let doc2snapshot = applyOp(doc2, op2);
    doc2 = applyOp(doc2snapshot, op12);

    expect(doc1).toStrictEqual(doc2);
  });

  describe('insertText', () => {
    // trivial but for coverage
    test('at some other place', () => {
      op1 = makeOp.setNode([1, 1], { italic: true });
      op2 = makeOp.insertText([1, 2], 1, 'but');
    });
  });

  describe('removeText', () => {
    // trivial
  });

  describe('insertNode', () => {
    test('at setOp.path.parent', () => {
      op1 = makeOp.setNode([1, 0], { italic: true });
      op2 = makeOp.removeNode([1], doc2.children[1]);
    });
  });

  describe('removeNode', () => {
    // trivial
  });

  describe('splitNode', () => {
    test('at setOp.path', () => {
      op1 = makeOp.setNode([1, 0], {italic: true});
      op2 = makeOp.splitNode([1, 0], 1, {bold: false});
    });
  });

  describe('mergeNode', () => {
    test('at setOp.path', () => {
      op1 = makeOp.setNode([1, 1], { italic: true });
      op2 = makeOp.mergeNode([1, 1], 2);
    });
  });

  describe('moveNode', () => {
    // trivial
  });

  describe('setNode', () => {
    test('at left.path', () => {
      op1 = makeOp.setNode([1, 1], { italic: true });
      op2 = makeOp.setNode([1, 1], { italic: false });
    });

    test('at some other place', () => {
      op1 = makeOp.setNode([1, 1], { italic: true });
      op2 = makeOp.setNode([1, 2], { italic: false });
    });
  });
});
