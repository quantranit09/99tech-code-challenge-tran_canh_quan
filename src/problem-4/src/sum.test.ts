import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./sum";

const ALL = [sum_to_n_a, sum_to_n_b, sum_to_n_c] as const;
const expectAll = (n: number, expected: number) => {
    ALL.forEach((fn) => expect(fn(n)).toBe(expected));
};

describe("sum_to_n – happy path", () => {
    test("n = 1 (smallest positive, boundary)", () => {
        expectAll(1, 1);
    });

    test("n = 5", () => {
        expectAll(5, 15);
    });

    test("n = 10", () => {
        expectAll(10, 55);
    });

    test("n = 100", () => {
        expectAll(100, 5050);
    });
});

describe("sum_to_n – boundary / edge cases", () => {
    test("n = 0 → returns 0", () => {
        expectAll(0, 0);
    });

    test("n = -1 (negative) → returns 0", () => {
        expectAll(-1, 0);
    });

    test("n = -100 (large negative) → returns 0", () => {
        expectAll(-100, 0);
    });
});

describe("sum_to_n – all three implementations agree", () => {
    const cases = [1, 2, 7, 42, 99];

    cases.forEach((n) => {
        test(`n = ${n}: iterative === recursive === formula`, () => {
            const a = sum_to_n_a(n);
            const b = sum_to_n_b(n);
            const c = sum_to_n_c(n);
            expect(a).toBe(b);
            expect(b).toBe(c);
        });
    });
});

describe("sum_to_n – invalid input (validateInput)", () => {
    test("NaN → throws", () => {
        ALL.forEach((fn) => {
            expect(() => fn(NaN)).toThrow("Input must be a finite number");
        });
    });

    test("Infinity → throws", () => {
        ALL.forEach((fn) => {
            expect(() => fn(Infinity)).toThrow("Input must be a finite number");
        });
    });

    test("-Infinity → throws", () => {
        ALL.forEach((fn) => {
            expect(() => fn(-Infinity)).toThrow("Input must be a finite number");
        });
    });

    test("float (1.5) → throws", () => {
        ALL.forEach((fn) => {
            expect(() => fn(1.5)).toThrow("Input must be an integer");
        });
    });

    test("float (-0.1) → throws", () => {
        ALL.forEach((fn) => {
            expect(() => fn(-0.1)).toThrow("Input must be an integer");
        });
    });
});