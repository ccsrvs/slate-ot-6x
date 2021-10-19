import {applyOp, initialDoc, makeOp} from "./utils";
import * as _ from 'lodash';

describe("operations on document", function () {
    let doc;
    let expectedDoc;

    let op;
    describe("single operations", function () {

        beforeEach(() => {
            doc = _.cloneDeep(initialDoc);
        });

        afterEach(() => {
            doc = applyOp(doc, op);

            // console.log(JSON.stringify(doc));
            // console.log(JSON.stringify(expectedDoc));

            expect(doc).toStrictEqual(expectedDoc);
        });

        it('should correctly apply the insertNode operation to a document', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB', italic: true}, {text: 'CD'}, {text: 'EF'}],
                    },
                    {
                        type: 'h1',
                        children: [{text: 'test'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ'}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.insertNode([1], {type: 'h1', children: [{text: 'test'}]});
        });

        it('should correctly apply the insertText operation to a document', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB', italic: true}, {text: 'COD'}, {text: 'EF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ'}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.insertText([0, 1], 1, 'O');
        });

        it('should correctly apply the insertText operation with properties to a document', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'ABC', italic: true}, {text: 'CD'}, {text: 'EF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ'}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.insertText([0, 0], 2, 'C');
        });

        it('should correctly apply the mergeNode operation to a leaf on a document', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB', italic: true}, {text: 'CDEF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ'}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.mergeNode([0, 2], 2);
        });

        it('should correctly apply the mergeNode operation to a non-leaf on a document', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB', italic: true}, {text: 'CD'}, {text: 'EF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{
                            text: 'GH',
                            bold: true
                        }, {text: 'IJ'}, {text: 'KL'}, {text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.mergeNode([2], 3);
        });

        it('should correctly apply the moveNode operation to a document', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB', italic: true}, {text: 'CD'}, {text: 'EF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ'}, {text: 'KL'}, {text: 'RST'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.moveNode([2, 2], [1, 3]);
        });

        it('should correctly apply the removeNode operation to a document', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB', italic: true}, {text: 'CD'}, {text: 'EF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.removeNode([1, 1], {text: 'IJ'});
        });

        it('should correctly apply the removeText operation to a document', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB', italic: true}, {text: 'CD'}, {text: 'EF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ'}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'PQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.removeText([2, 1], 0, 'O');
        });
        it('should correctly apply the setNode operation to a document without existing formatting', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB', italic: true}, {text: 'CD', bold: true}, {text: 'EF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ'}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.setNode([0, 1], {bold: true});
        });
        it('should correctly apply the setNode operation to a document with same existing formatting', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB'}, {text: 'CD'}, {text: 'EF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ'}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.setNode([0, 0], {}, {italic: true});
        });
        it('should correctly apply the setNode operation to a document with different existing formatting', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB', italic: true, underline: true}, {text: 'CD'}, {text: 'EF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ'}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.setNode([0, 0], {underline: true});
        });
        it('should correctly apply the splitNode operation to a leaf on a document and maintain existing formatting', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'A', italic: true}, {text: 'B', italic: true}, {text: 'CD'}, {text: 'EF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ'}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.splitNode([0, 0], 1, {italic: true});
        });
        it('should correctly apply the splitNode operation to a non-leaf on a document and maintain existing formatting', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB', italic: true}, {text: 'CD'}, {text: 'EF'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'IJ'}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.splitNode([1], 1, {type: 'NumberedList'});
        });
    });
    const multOpsDoc = {
        children: [
            {
                type: 'Paragraph',
                children: [{text: 'ABCDEF', italic: true}],
            },
            {
                type: 'NumberedList',
                children: [{text: 'GH', bold: true}, {text: 'IJ', bold: true, italic: true}, {text: 'KL'}],
            },
            {
                type: 'BulletedList',
                children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
            },
        ]
    };
    describe("multiple operations", function () {
        beforeEach(() => {
            doc = _.cloneDeep(multOpsDoc);
        });

        it('should correctly apply a series of set, split, and merge nodes on a document', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'AB', italic: true}, {text: 'CD', italic: true, bold: true}, {text: 'EF', italic: true, bold: true, underline: true}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ', bold: true, italic: true}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };
            op = makeOp.splitNode([0,0], 2, {text: undefined, italic: true});
            doc = applyOp(doc, op);

            op = makeOp.setNode([0,1], {bold: true});
            doc = applyOp(doc, op);

            op = makeOp.splitNode([0,1], 2, {text: undefined, italic: true, bold: true});
            doc = applyOp(doc, op);

            op = makeOp.setNode([0,2], {underline: true});
            doc = applyOp(doc, op);

            expect(doc).toStrictEqual(expectedDoc);

            op = makeOp.setNode([0,2], {}, {underline: true});
            doc = applyOp(doc, op);

            op = makeOp.mergeNode([0,2], 2);
            doc = applyOp(doc, op);

            op = makeOp.setNode([0,1], {}, {bold: true});
            doc = applyOp(doc, op);

            op = makeOp.mergeNode([0,1], 2);
            doc = applyOp(doc, op);

            expect(doc).toStrictEqual({...multOpsDoc, selection: null});

            op = makeOp.splitNode([0,0], 2, {text: undefined, italic: true});
            doc = applyOp(doc, op);

            op = makeOp.setNode([0,0], {bold: true});
            doc = applyOp(doc, op);

            op = makeOp.setNode([0,0], {}, {bold: true});
            doc = applyOp(doc, op);

            op = makeOp.mergeNode([0,1], 2);
            doc = applyOp(doc, op);

            expect(doc).toStrictEqual({...multOpsDoc, selection: null});
        });

        it('should correctly apply a series of ops on a document to mimic a cut and paste', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: '', bold: true}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'GH', bold: true}, {text: 'IJ', bold: true, italic: true}, {text: 'KL'}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'OPQ'}, {text: 'RST'}],
                    },
                    {
                        type: 'Paragraph',
                        children: [{text: 'ABC', italic: true}, {text: 'DEFX', bold: true}],
                    },
                ],
                selection: null,
            };
            op = makeOp.splitNode([0,0], 3, {italic: true});
            doc = applyOp(doc, op);

            op = makeOp.setNode([0,1], {}, {italic: true});
            doc = applyOp(doc, op);

            op = makeOp.setNode([0,1], {bold: true});
            doc = applyOp(doc, op);

            op = makeOp.removeText([0,0], 0, 'ABC');
            doc = applyOp(doc, op);

            op = makeOp.removeText([0,1], 0, 'DEF');
            doc = applyOp(doc, op);

            op = makeOp.removeNode([0,0], {text: '', italic: true});
            doc = applyOp(doc, op);

            op = makeOp.insertNode([3], {type: 'Paragraph', children: [{text: 'ABC', italic: true}, {text: 'DEF', bold: true}]});
            doc = applyOp(doc, op);

            op = makeOp.insertText([3,1], 3, 'X');
            doc = applyOp(doc, op);

            expect(doc).toStrictEqual(expectedDoc);
        });

        it('should correctly apply a series of ops on a document to model block-level transforms', function () {
            expectedDoc = {
                children: [
                    {
                        type: 'Paragraph',
                        children: [{text: 'ABCDEF', italic: true}],
                    },
                    {
                        type: 'AlignCenter',
                        children: [{
                                type: 'Paragraph',
                                children: [{text: 'GH', bold: true}, {text: 'IJ', bold: true, italic: true}, {text: 'KL'}]}],
                    },
                    {
                        type: 'BulletedList',
                        children: [{text: 'MN'}, {text: 'O'}],
                    },
                    {
                        type: 'NumberedList',
                        children: [{text: 'PQ'}, {text: 'RST'}],
                    },
                ],
                selection: null,
            };

            op = makeOp.splitNode([2,1], 1, {text: undefined});
            doc = applyOp(doc, op);

            op = makeOp.splitNode([2], 2, {type: 'BulletedList'});
            doc = applyOp(doc, op);

            op = makeOp.setNode([3], {type: 'NumberedList'}, {type: 'BulletedList'});
            doc = applyOp(doc, op);

            op = makeOp.setNode([1], {type: 'Paragraph'}, {type: 'NumberedList'});
            doc = applyOp(doc, op);

            op = makeOp.insertNode([2], {type: 'AlignCenter', children: []});
            doc = applyOp(doc, op);

            op = makeOp.moveNode([1], [2,0]);
            doc = applyOp(doc, op);

            expect(doc).toStrictEqual(expectedDoc);
        });
    });
});