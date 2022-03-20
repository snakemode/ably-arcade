import { Scoreboard } from "./Scoreboard";

describe("Scoreboard", () => {

    let sut: Scoreboard;

    beforeEach(() => {
        sut = new Scoreboard();
    });

    it("addRange, adds supplied scores", () => {
        sut.addRange([
            { name: "a", score: 1 }, 
            { name: "b", score: 1 }
        ]);

        expect(sut.scores.length).toBe(2);
        expect(sut.scores[0].name).toBe("a");
        expect(sut.scores[1].name).toBe("b");
    });

    it("addRange, sorts supplied scores", () => {
        sut.addRange([
            { name: "a", score: 1 }, 
            { name: "b", score: 20 }
        ]);

        expect(sut.scores.length).toBe(2);
        expect(sut.scores[0].name).toBe("b")
        expect(sut.scores[1].name).toBe("a");
    });
});