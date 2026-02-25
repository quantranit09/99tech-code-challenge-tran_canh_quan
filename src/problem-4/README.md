# Problem 4 – Three Ways to Sum to n

## Overview

This problem implements three different approaches to compute the summation:

sum_to_n(5) = 1 + 2 + 3 + 4 + 5 = 15

Input: any integer n
Output: sum from 1 to n

If n <= 0, the function returns 0.

---

## Implementations

### 1. Iterative Approach

- Time Complexity: O(n)
- Space Complexity: O(1)

Uses a simple loop to accumulate the result.
Practical and safe for moderate input sizes.

---

### 2. Recursive Approach

- Time Complexity: O(n)
- Space Complexity: O(n)

Demonstrates recursive thinking.
Not recommended for large n due to potential stack overflow.

---

### 3. Mathematical Formula (Gauss Formula)

- Time Complexity: O(1)
- Space Complexity: O(1)

Uses the formula:

n \* (n + 1) / 2

This is the most optimal solution for production use.

---

## Conclusion

While all three approaches produce the same result, the mathematical
formula is optimal due to constant time and space complexity.

The iterative approach is safe and practical.
The recursive approach is mainly educational.
