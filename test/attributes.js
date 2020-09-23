const CSSselect = require("../src");
const makeDom = require("htmlparser2").parseDOM;
const { falseFunc } = require("boolbase");
const assert = require("assert");

const dom = makeDom(
    '<div><div data-foo="In the end, it doesn\'t really matter."></div><div data-foo="Indeed-that\'s a delicate matter.">'
);

describe("Attributes", () => {
    describe("ignore case", () => {
        it("should for =", () => {
            let matches = CSSselect.selectAll(
                '[data-foo="indeed-that\'s a delicate matter." i]',
                dom
            );
            assert.equal(matches.length, 1);
            assert.deepEqual(matches, [dom[0].children[1]]);
            matches = CSSselect.selectAll(
                '[data-foo="inDeeD-THAT\'s a DELICATE matteR." i]',
                dom
            );
            assert.deepEqual(matches, [dom[0].children[1]]);
        });

        it("should for ^=", () => {
            let matches = CSSselect.selectAll("[data-foo^=IN i]", dom);
            assert.equal(matches.length, 2);
            assert.deepEqual(matches, dom[0].children);
            matches = CSSselect.selectAll("[data-foo^=in i]", dom);
            assert.deepEqual(matches, dom[0].children);
            matches = CSSselect.selectAll("[data-foo^=iN i]", dom);
            assert.deepEqual(matches, dom[0].children);
        });

        it("should for $=", () => {
            let matches = CSSselect.selectAll('[data-foo$="MATTER." i]', dom);
            assert.equal(matches.length, 2);
            assert.deepEqual(matches, dom[0].children);
            matches = CSSselect.selectAll('[data-foo$="matter." i]', dom);
            assert.deepEqual(matches, dom[0].children);
            matches = CSSselect.selectAll('[data-foo$="MaTtEr." i]', dom);
            assert.deepEqual(matches, dom[0].children);
        });

        it("should for !=", () => {
            let matches = CSSselect.selectAll(
                '[data-foo!="indeed-that\'s a delicate matter." i]',
                dom
            );
            assert.equal(matches.length, 1);
            assert.deepEqual(matches, [dom[0].children[0]]);
            matches = CSSselect.selectAll(
                '[data-foo!="inDeeD-THAT\'s a DELICATE matteR." i]',
                dom
            );
            assert.deepEqual(matches, [dom[0].children[0]]);
        });

        it("should for *=", () => {
            let matches = CSSselect.selectAll("[data-foo*=IT i]", dom);
            assert.equal(matches.length, 1);
            assert.deepEqual(matches, [dom[0].children[0]]);
            matches = CSSselect.selectAll("[data-foo*=tH i]", dom);
            assert.deepEqual(matches, dom[0].children);
        });

        it("should for |=", () => {
            let matches = CSSselect.selectAll("[data-foo|=indeed i]", dom);
            assert.equal(matches.length, 1);
            assert.deepEqual(matches, [dom[0].children[1]]);
            matches = CSSselect.selectAll("[data-foo|=inDeeD i]", dom);
            assert.deepEqual(matches, [dom[0].children[1]]);
        });

        it("should for ~=", () => {
            let matches = CSSselect.selectAll("[data-foo~=IT i]", dom);
            assert.equal(matches.length, 1);
            assert.deepEqual(matches, [dom[0].children[0]]);
            matches = CSSselect.selectAll("[data-foo~=dElIcAtE i]", dom);
            assert.deepEqual(matches, [dom[0].children[1]]);
        });
    });

    describe("no matches", () => {
        it("should for ~=", () => {
            assert.equal(
                CSSselect._compileUnsafe("[foo~='baz bar']"),
                falseFunc
            );
        });

        it("should for $=", () => {
            assert.equal(CSSselect._compileUnsafe("[foo$='']"), falseFunc);
        });

        it("should for *=", () => {
            assert.equal(CSSselect._compileUnsafe("[foo*='']"), falseFunc);
        });
    });
});
