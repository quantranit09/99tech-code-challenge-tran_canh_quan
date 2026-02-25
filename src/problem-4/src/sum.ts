/**
 * Problem 4 – Three Ways to Sum to n
 *
 * Assumptions:
 * - n is an integer
 * - If n <= 0, result is 0
 * - Result will not exceed Number.MAX_SAFE_INTEGER
 */

/**
 * Version A – Iterative
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export function sum_to_n_a(n: number): number {
    validateInput(n);

    if (n <= 0) return 0;

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
}

/**
 * Version B – Recursive
 * Time Complexity: O(n)
 * Space Complexity: O(n) due to call stack
 *
 * Note: Not recommended for large n due to potential stack overflow.
 */
export function sum_to_n_b(n: number): number {
    validateInput(n);
    return _sum_recursive(n);
}

function _sum_recursive(n: number): number {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return n + _sum_recursive(n - 1);
}

/**
 * Version C – Mathematical Formula (Gauss Formula)
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 *
 * Most optimal solution for production use.
 */
export function sum_to_n_c(n: number): number {
    validateInput(n);

    if (n <= 0) return 0;

    return (n * (n + 1)) / 2;
}

function isInteger(n: number): boolean {
    return Number.isInteger(n);
}

function validateInput(n: number): void {
    if (!isFinite(n)) {
        throw new Error("Input must be a finite number");
    }

    if (!isInteger(n)) {
        throw new Error("Input must be an integer");
    }
}