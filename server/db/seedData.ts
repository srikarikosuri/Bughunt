export interface TestCaseSeed {
  id: string;
  challenge_id: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  order_num: number;
}

export interface ChallengeSeed {
  id: string;
  title: string;
  slug: string;
  language: 'python' | 'javascript' | 'java' | 'c';
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'syntax' | 'logic' | 'runtime' | 'algorithmic';
  xp_reward: number;
  description: string;
  broken_code: string;
  correct_solution: string;
  hints: string[];
  is_daily?: boolean;
}

export interface BadgeSeed {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xp_bonus: number;
}

export const INITIAL_BADGES: BadgeSeed[] = [
  {
    id: 'badge-1',
    key: 'first-bug-fixed',
    name: 'First Bug Fixed',
    description: 'Squashed your very first software bug in BugHunt.',
    icon: 'Bug',
    category: 'milestone',
    xp_bonus: 50,
  },
  {
    id: 'badge-2',
    key: 'python-pro',
    name: 'Python Pro',
    description: 'Successfully solved 3 Python debugging challenges.',
    icon: 'Terminal',
    category: 'language',
    xp_bonus: 75,
  },
  {
    id: 'badge-3',
    key: 'js-wizard',
    name: 'JS Wizard',
    description: 'Mastered 3 JavaScript debugging challenges.',
    icon: 'Code2',
    category: 'language',
    xp_bonus: 75,
  },
  {
    id: 'badge-4',
    key: 'c-hacker',
    name: 'C Hacker',
    description: 'Diagnosed and repaired memory/syntax bugs in C.',
    icon: 'Cpu',
    category: 'language',
    xp_bonus: 100,
  },
  {
    id: 'badge-5',
    key: 'java-titan',
    name: 'Java Titan',
    description: 'Overcame object references and exceptions in Java.',
    icon: 'Coffee',
    category: 'language',
    xp_bonus: 100,
  },
  {
    id: 'badge-6',
    key: '7-day-streak',
    name: '7-Day Streak',
    description: 'Maintained an unbroken daily debugging streak for 7 days.',
    icon: 'Flame',
    category: 'streak',
    xp_bonus: 150,
  },
  {
    id: 'badge-7',
    key: 'debugging-master',
    name: 'Debugging Master',
    description: 'Repaired 10 or more bugs across all languages.',
    icon: 'Trophy',
    category: 'mastery',
    xp_bonus: 200,
  },
  {
    id: 'badge-8',
    key: 'speed-demon',
    name: 'Speed Demon',
    description: 'Solved a challenge in under 120 seconds.',
    icon: 'Zap',
    category: 'performance',
    xp_bonus: 50,
  },
];

export const INITIAL_CHALLENGES: ChallengeSeed[] = [
  // 1. Python Syntax
  {
    id: 'ch-py-1',
    title: 'Palindrome Syntax Glitch',
    slug: 'python-palindrome-syntax-glitch',
    language: 'python',
    difficulty: 'easy',
    category: 'syntax',
    xp_reward: 10,
    description: `A junior engineer attempted to write a simple palindrome checker in Python, but when trying to run it, the Python interpreter screams with syntax and indentation errors.

Fix the syntax errors (missing colons, improper lowercase conversion, and indentation) so that the function checks if a string is identical forwards and backwards (ignoring case).`,
    broken_code: `def is_palindrome(text)
    clean_text = text.lower()
  reversed_text = clean_text[::-1]
    if clean_text == reversed_text
        return True
    else
        return False

# Read input from standard input
import sys
if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        print(is_palindrome(line))
`,
    correct_solution: `def is_palindrome(text):
    clean_text = text.lower()
    reversed_text = clean_text[::-1]
    if clean_text == reversed_text:
        return True
    else:
        return False

import sys
if __name__ == '__main__':
    line = sys.stdin.read().strip()
    if line:
        print(is_palindrome(line))
`,
    hints: [
      'Look at function and conditional declarations in Python: each `def`, `if`, and `else` line must end with a colon `:`',
      'Check indentation: all statements inside the function body must share the exact same indentation level (4 spaces).',
    ],
    is_daily: true,
  },

  // 2. Python Logic
  {
    id: 'ch-py-2',
    title: 'Off-By-One Array Chunking',
    slug: 'python-off-by-one-chunking',
    language: 'python',
    difficulty: 'easy',
    category: 'logic',
    xp_reward: 10,
    description: `The function \`chunk_list(nums, size)\` is supposed to divide a list into contiguous sublists of length \`size\`. However, because of an off-by-one slicing index and step bug, elements are either being skipped or sliced incorrectly!

Fix the logic error in the range step so all elements are partitioned properly.`,
    broken_code: `import sys
import json

def chunk_list(arr, size):
    result = []
    # BUG: Range step is size - 1, causing duplicate overlap!
    for i in range(0, len(arr), size - 1):
        result.append(arr[i:i + size])
    return result

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if raw:
        data = json.loads(raw)
        arr = data['arr']
        size = data['size']
        print(json.dumps(chunk_list(arr, size)))
`,
    correct_solution: `import sys
import json

def chunk_list(arr, size):
    result = []
    for i in range(0, len(arr), size):
        result.append(arr[i:i + size])
    return result

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if raw:
        data = json.loads(raw)
        arr = data['arr']
        size = data['size']
        print(json.dumps(chunk_list(arr, size)))
`,
    hints: [
      'Examine the 3rd argument in `range(0, len(arr), step)`. When moving to the next chunk of `size`, by how much should `i` increment?',
      'If chunk size is 2, the index should advance by 2 each loop, not `size - 1`.',
    ],
  },

  // 3. Python Runtime
  {
    id: 'ch-py-3',
    title: 'Zero Division & Missing Key in Grade Average',
    slug: 'python-grade-average-runtime-error',
    language: 'python',
    difficulty: 'medium',
    category: 'runtime',
    xp_reward: 25,
    description: `A school grading service crashes whenever calculating grade averages for a student whose records contain an empty score array or missing grade keys. It raises \`ZeroDivisionError\` or \`KeyError\`.

Modify the function \`calculate_average(student_record)\` so that:
- If scores list is empty or student has no valid numerical scores, return \`0.0\`.
- Safely retrieve \`'scores'\` without triggering a KeyError.
- Return the average rounded to 2 decimal places.`,
    broken_code: `import sys
import json

def calculate_average(record):
    # BUG: Direct dictionary indexing crashes if key missing,
    # and dividing by len(scores) without checking 0 raises ZeroDivisionError!
    scores = record['scores']
    total = sum(scores)
    average = total / len(scores)
    return round(average, 2)

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if raw:
        record = json.loads(raw)
        print(calculate_average(record))
`,
    correct_solution: `import sys
import json

def calculate_average(record):
    scores = record.get('scores', [])
    if not scores:
        return 0.0
    total = sum(scores)
    average = total / len(scores)
    return round(average, 2)

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if raw:
        record = json.loads(raw)
        print(calculate_average(record))
`,
    hints: [
      'Use `record.get("scores", [])` to gracefully default when the "scores" key does not exist.',
      'Check `if not scores:` before performing the division to guard against empty lists.',
    ],
  },

  // 4. Python Algorithmic
  {
    id: 'ch-py-4',
    title: 'Binary Search Infinite Loop',
    slug: 'python-binary-search-infinite-loop',
    language: 'python',
    difficulty: 'medium',
    category: 'algorithmic',
    xp_reward: 25,
    description: `Binary search is one of the most fundamental search algorithms with O(log n) time complexity. However, this implementation enters an infinite loop or returns the wrong index when searching for items!

Identify why \`left\` and \`right\` pointers fail to converge and fix the index adjustments so the function returns the 0-based index of \`target\`, or \`-1\` if not found.`,
    broken_code: `import sys
import json

def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            # BUG: Not advancing past mid!
            left = mid
        else:
            # BUG: Not stepping back from mid!
            right = mid
            
    return -1

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if raw:
        data = json.loads(raw)
        print(binary_search(data['arr'], data['target']))
`,
    correct_solution: `import sys
import json

def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if raw:
        data = json.loads(raw)
        print(binary_search(data['arr'], data['target']))
`,
    hints: [
      'When `arr[mid] < target`, we already know `arr[mid]` is not the target, so `left` should move to `mid + 1`.',
      'Similarly, when `arr[mid] > target`, `right` should be set to `mid - 1`.',
    ],
  },

  // 5. JavaScript Syntax
  {
    id: 'ch-js-1',
    title: 'Broken Currency Formatter Template',
    slug: 'javascript-currency-formatter-syntax',
    language: 'javascript',
    difficulty: 'easy',
    category: 'syntax',
    xp_reward: 10,
    description: `A front-end dev wrote a currency formatter function using modern ES6 arrow syntax and template literals. Unfortunately, unclosed curly braces and mismatched quotation marks prevent the JavaScript parser from even compiling!

Fix the syntax errors in \`formatCurrency\` so it formats amounts with currency symbol and 2 decimals (e.g., "$12.50").`,
    broken_code: `function formatCurrency(amount, symbol = '$') {
  // BUG: Mismatched quotes, unclosed arrow brackets and missing backtick
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Invalid Amount';
  }
  const formatted = amount.toFixed(2);
  return \`\${symbol}\${formatted";
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
let input = '';
rl.on('line', line => { input += line; });
rl.on('close', () => {
  if (input.trim()) {
    const data = JSON.parse(input);
    console.log(formatCurrency(data.amount, data.symbol));
  }
});
`,
    correct_solution: `function formatCurrency(amount, symbol = '$') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Invalid Amount';
  }
  const formatted = amount.toFixed(2);
  return \`\${symbol}\${formatted}\`;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
let input = '';
rl.on('line', line => { input += line; });
rl.on('close', () => {
  if (input.trim()) {
    const data = JSON.parse(input);
    console.log(formatCurrency(data.amount, data.symbol));
  }
});
`,
    hints: [
      'Check the template literal on line 7: Notice how backtick starts but ends with a double quote `"` instead of a backtick \`\`.',
      'Ensure the interpolation expression `\${formatted}` has a closing curly brace `}`.',
    ],
  },

  // 6. JavaScript Logic
  {
    id: 'ch-js-2',
    title: 'Closure Loop Variable Capture',
    slug: 'javascript-closure-loop-variable-capture',
    language: 'javascript',
    difficulty: 'easy',
    category: 'logic',
    xp_reward: 10,
    description: `In JavaScript, function closures capturing a loop index declared with \`var\` share the same hoisted variable reference across all iterations. Because of this, every generated function returns the same final value!

Refactor the loop or variable scoping so that each generated callback in the array returns its corresponding multiplier index.`,
    broken_code: `function createMultipliers(n) {
  var funcs = [];
  // BUG: Using 'var' means 'i' is function-scoped and hoisted.
  // By the time functions are called, 'i' equals 'n'.
  for (var i = 0; i < n; i++) {
    funcs.push(function(val) {
      return val * i;
    });
  }
  return funcs;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
let input = '';
rl.on('line', line => { input += line; });
rl.on('close', () => {
  if (input.trim()) {
    const data = JSON.parse(input);
    const multipliers = createMultipliers(data.count);
    const results = multipliers.map(fn => fn(data.multiplier));
    console.log(JSON.stringify(results));
  }
});
`,
    correct_solution: `function createMultipliers(n) {
  const funcs = [];
  for (let i = 0; i < n; i++) {
    funcs.push(function(val) {
      return val * i;
    });
  }
  return funcs;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
let input = '';
rl.on('line', line => { input += line; });
rl.on('close', () => {
  if (input.trim()) {
    const data = JSON.parse(input);
    const multipliers = createMultipliers(data.count);
    const results = multipliers.map(fn => fn(data.multiplier));
    console.log(JSON.stringify(results));
  }
});
`,
    hints: [
      'In ES6+, replace `var i = 0` with `let i = 0` to create a fresh block scope for every iteration of the loop.',
      'Alternatively, use an immediately invoked function expression (IIFE), but `let` is the standard modern fix.',
    ],
  },

  // 7. JavaScript Runtime
  {
    id: 'ch-js-3',
    title: 'Cannot Read Properties of Undefined',
    slug: 'javascript-deep-object-property-access',
    language: 'javascript',
    difficulty: 'medium',
    category: 'runtime',
    xp_reward: 25,
    description: `A common runtime crash in JavaScript occurs when navigating nested properties of an object where an intermediate key is \`null\` or \`undefined\`:
\`TypeError: Cannot read properties of undefined (reading 'country')\`.

Implement or fix \`getUserCountryCode(user)\` to safely extract \`user.profile.address.country.code\`. If any level in the hierarchy is missing, return \`"UNKNOWN"\`.`,
    broken_code: `function getUserCountryCode(user) {
  // BUG: Direct property chains throw TypeError if profile, address, or country is null/undefined!
  return user.profile.address.country.code.toUpperCase();
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
let input = '';
rl.on('line', line => { input += line; });
rl.on('close', () => {
  if (input.trim()) {
    const user = JSON.parse(input);
    console.log(getUserCountryCode(user));
  }
});
`,
    correct_solution: `function getUserCountryCode(user) {
  const code = user?.profile?.address?.country?.code;
  return code ? code.toUpperCase() : "UNKNOWN";
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
let input = '';
rl.on('line', line => { input += line; });
rl.on('close', () => {
  if (input.trim()) {
    const user = JSON.parse(input);
    console.log(getUserCountryCode(user));
  }
});
`,
    hints: [
      'Use optional chaining `?.` introduced in ECMAScript 2020: `user?.profile?.address?.country?.code`.',
      'Return `"UNKNOWN"` if the resulting code is undefined or empty string.',
    ],
  },

  // 8. JavaScript Algorithmic
  {
    id: 'ch-js-4',
    title: 'Two Sum Duplicate Value Bug',
    slug: 'javascript-two-sum-duplicate-bug',
    language: 'javascript',
    difficulty: 'medium',
    category: 'algorithmic',
    xp_reward: 25,
    description: `Given an array of integers \`nums\` and an integer \`target\`, find the indices of the two numbers such that they add up to \`target\`.

The buggy code populates a hash map before checking, causing duplicate numbers (like \`[3, 3]\` with target \`6\`) to overwrite each other's indices or match the same element with itself!

Fix the algorithm so it returns \`[i, j]\` in ascending order, or \`[]\` if no pair exists.`,
    broken_code: `function twoSum(nums, target) {
  const map = {};
  // BUG: Storing all elements first causes duplicate keys to overwrite,
  // and checking later can match the same element twice!
  for (let i = 0; i < nums.length; i++) {
    map[nums[i]] = i;
  }

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement]) {
      return [i, map[complement]];
    }
  }
  return [];
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
let input = '';
rl.on('line', line => { input += line; });
rl.on('close', () => {
  if (input.trim()) {
    const data = JSON.parse(input);
    console.log(JSON.stringify(twoSum(data.nums, data.target)));
  }
});
`,
    correct_solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
let input = '';
rl.on('line', line => { input += line; });
rl.on('close', () => {
  if (input.trim()) {
    const data = JSON.parse(input);
    console.log(JSON.stringify(twoSum(data.nums, data.target)));
  }
});
`,
    hints: [
      'Single-pass hash table: Check if `complement` exists in the map BEFORE adding the current element `nums[i]`.',
      'Remember that index 0 is falsy in JavaScript (`if (map[complement])` fails when index is 0!). Use `map.has()` or `complement in map`.',
    ],
  },

  // 9. Java Syntax
  {
    id: 'ch-java-1',
    title: 'Temperature Converter Type Cast & Semicolon',
    slug: 'java-temperature-converter-syntax',
    language: 'java',
    difficulty: 'easy',
    category: 'syntax',
    xp_reward: 10,
    description: `In Java, every statement must terminate with a semicolon, and integer division truncates decimal values. The developer trying to implement Celsius to Fahrenheit converter \`F = (C * 9 / 5) + 32\` missed punctuation and introduced integer truncation!

Fix the compiler errors and integer division so \`toFahrenheit(celsius)\` returns a double rounded to 1 decimal place.`,
    broken_code: `import java.util.Scanner;

public class Solution {
    public static double toFahrenheit(double celsius) {
        // BUG: Missing semicolon and integer division (9/5 truncates to 1)
        double f = (celsius * 9 / 5) + 32
        return Math.round(f * 10.0) / 10.0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextDouble()) {
            double c = scanner.nextDouble();
            System.out.println(toFahrenheit(c));
        }
        scanner.close();
    }
}
`,
    correct_solution: `import java.util.Scanner;

public class Solution {
    public static double toFahrenheit(double celsius) {
        double f = (celsius * 9.0 / 5.0) + 32.0;
        return Math.round(f * 10.0) / 10.0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextDouble()) {
            double c = scanner.nextDouble();
            System.out.println(toFahrenheit(c));
        }
        scanner.close();
    }
}
`,
    hints: [
      'Notice line 6 lacks a semicolon `;` at the end of the variable assignment.',
      'Use `9.0 / 5.0` instead of integer `9 / 5` to prevent truncation in floating-point operations.',
    ],
  },

  // 10. Java Logic
  {
    id: 'ch-java-2',
    title: 'String Reference Equality vs .equals()',
    slug: 'java-string-equality-bug',
    language: 'java',
    difficulty: 'medium',
    category: 'logic',
    xp_reward: 25,
    description: `A security gate in a Java authentication microservice is failing users because it compares dynamic string tokens using reference equality \`==\` rather than value equality \`.equals()\`.

In Java, \`==\` checks if both references point to the exact same memory address on the heap, not whether their contents match! Fix the logic.`,
    broken_code: `import java.util.Scanner;

public class Solution {
    public static boolean validateToken(String receivedToken, String expectedSecret) {
        if (receivedToken == null || expectedSecret == null) {
            return false;
        }
        // BUG: In Java, '==' compares memory references, not string characters!
        return receivedToken == expectedSecret;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String token = scanner.next();
            // Expected hardcoded secret
            String secret = new String("BUGHUNT_SECRET_2026");
            System.out.println(validateToken(token, secret));
        }
        scanner.close();
    }
}
`,
    correct_solution: `import java.util.Scanner;

public class Solution {
    public static boolean validateToken(String receivedToken, String expectedSecret) {
        if (receivedToken == null || expectedSecret == null) {
            return false;
        }
        return receivedToken.equals(expectedSecret);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String token = scanner.next();
            String secret = new String("BUGHUNT_SECRET_2026");
            System.out.println(validateToken(token, secret));
        }
        scanner.close();
    }
}
`,
    hints: [
      'Replace the `==` comparison with `receivedToken.equals(expectedSecret)`.',
      'String objects instantiated at runtime reside at different memory addresses, so `.equals()` must be used to compare contents.',
    ],
  },

  // 11. Java Runtime
  {
    id: 'ch-java-3',
    title: 'ArrayIndexOutOfBounds in In-Place Array Reversal',
    slug: 'java-array-out-of-bounds-reversal',
    language: 'java',
    difficulty: 'medium',
    category: 'runtime',
    xp_reward: 25,
    description: `The developer implemented an in-place array reversal method \`reverseArray(int[] arr)\`.
However, running it immediately throws \`java.lang.ArrayIndexOutOfBoundsException\` because the loop index bounds are wrong, and elements are swapped back to their original position!

Fix the array indexing and loop condition so the array is reversed correctly.`,
    broken_code: `import java.util.Scanner;
import java.util.Arrays;

public class Solution {
    public static void reverseArray(int[] arr) {
        // BUG: i <= arr.length accesses arr[arr.length], causing ArrayIndexOutOfBoundsException!
        // Also looping until length causes elements to be swapped twice.
        for (int i = 0; i <= arr.length; i++) {
            int temp = arr[i];
            arr[i] = arr[arr.length - i];
            arr[arr.length - i] = temp;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) {
                arr[i] = scanner.nextInt();
            }
            reverseArray(arr);
            System.out.println(Arrays.toString(arr));
        }
        scanner.close();
    }
}
`,
    correct_solution: `import java.util.Scanner;
import java.util.Arrays;

public class Solution {
    public static void reverseArray(int[] arr) {
        for (int i = 0; i < arr.length / 2; i++) {
            int opposite = arr.length - 1 - i;
            int temp = arr[i];
            arr[i] = arr[opposite];
            arr[opposite] = temp;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) {
                arr[i] = scanner.nextInt();
            }
            reverseArray(arr);
            System.out.println(Arrays.toString(arr));
        }
        scanner.close();
    }
}
`,
    hints: [
      'The last element index in Java is `arr.length - 1`. Accessing `arr[arr.length]` will crash.',
      'Only loop halfway (`i < arr.length / 2`), otherwise you swap the items twice, leaving them in their original order.',
    ],
  },

  // 12. Java Algorithmic
  {
    id: 'ch-java-4',
    title: 'Missing Base Case & Recursion Stack Overflow',
    slug: 'java-recursion-stack-overflow',
    language: 'java',
    difficulty: 'hard',
    category: 'algorithmic',
    xp_reward: 50,
    description: `A recursive Fibonacci generator throws \`java.lang.StackOverflowError\` on non-trivial inputs because negative inputs are not guarded against and the base case is incomplete.

Implement an efficient Fibonacci algorithm or fix the recursion with proper memoization/iteration so it computes \`fib(n)\` for $n \\in [0, 50]$ in O(n) time.`,
    broken_code: `import java.util.Scanner;

public class Solution {
    // BUG: Missing base case for n <= 0, causing infinite recursive depth & StackOverflowError
    public static long fib(int n) {
        if (n == 1) return 1;
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            System.out.println(fib(n));
        }
        scanner.close();
    }
}
`,
    correct_solution: `import java.util.Scanner;

public class Solution {
    public static long fib(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        long a = 0;
        long b = 1;
        for (int i = 2; i <= n; i++) {
            long temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            System.out.println(fib(n));
        }
        scanner.close();
    }
}
`,
    hints: [
      'Check `if (n <= 0) return 0;` and `if (n == 1) return 1;`.',
      'For inputs like n = 45, exponential O(2^n) recursion will time out! Use an iterative approach with two variables (`a` and `b`) to achieve O(n) performance.',
    ],
  },

  // 13. C Syntax
  {
    id: 'ch-c-1',
    title: 'Factorial Format Specifier & Header Mismatch',
    slug: 'c-factorial-syntax-format-mismatch',
    language: 'c',
    difficulty: 'easy',
    category: 'syntax',
    xp_reward: 10,
    description: `In C, missing essential standard library headers leads to implicit declaration warnings or errors, and format specifiers in \`printf\` must match the variable type.

Fix the syntax errors, missing header, and printf format specifier so the program computes and prints the factorial of an integer.`,
    broken_code: `// BUG: Missing <stdio.h> header
int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    int n;
    // BUG: Missing address-of '&' operator in scanf, and wrong specifier
    scanf("%d", n);
    int res = factorial(n);
    printf("%s\n", res);
    return 0;
}
`,
    correct_solution: `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        int res = factorial(n);
        printf("%d\n", res);
    }
    return 0;
}
`,
    hints: [
      'Include `#include <stdio.h>` at the very top of the file for `scanf` and `printf`.',
      '`scanf("%d", &n)` requires the address operator `&` before `n`.',
      'In `printf`, use `%d` for integers, not `%s` which expects a null-terminated string pointer.',
    ],
  },

  // 14. C Logic
  {
    id: 'ch-c-2',
    title: 'Off-by-One Null Terminator in String Reverse',
    slug: 'c-string-reverse-null-terminator-bug',
    language: 'c',
    difficulty: 'medium',
    category: 'logic',
    xp_reward: 25,
    description: `In C, strings are null-terminated character arrays (\`'\\0'\`). The following function attempts to reverse a string in-place, but swaps the null terminator into the front or middle of the string, causing truncation or garbage memory reads!

Fix the string reversal logic so that \`str\` is reversed properly while maintaining the null terminator at its original position.`,
    broken_code: `#include <stdio.h>
#include <string.h>

void reverse_string(char* str) {
    int len = strlen(str);
    // BUG: Swapping from 'len' includes the '\\0' null terminator,
    // corrupting the string!
    for (int i = 0; i < len / 2; i++) {
        char temp = str[i];
        str[i] = str[len - i];
        str[len - i] = temp;
    }
}

int main() {
    char buffer[256];
    if (fgets(buffer, sizeof(buffer), stdin)) {
        // Strip newline
        buffer[strcspn(buffer, "\r\n")] = 0;
        reverse_string(buffer);
        printf("%s\n", buffer);
    }
    return 0;
}
`,
    correct_solution: `#include <stdio.h>
#include <string.h>

void reverse_string(char* str) {
    int len = strlen(str);
    for (int i = 0; i < len / 2; i++) {
        int opposite = len - 1 - i;
        char temp = str[i];
        str[i] = str[opposite];
        str[opposite] = temp;
    }
}

int main() {
    char buffer[256];
    if (fgets(buffer, sizeof(buffer), stdin)) {
        buffer[strcspn(buffer, "\r\n")] = 0;
        reverse_string(buffer);
        printf("%s\n", buffer);
    }
    return 0;
}
`,
    hints: [
      'The index of the last printable character before the null terminator is `len - 1`, not `len`.',
      'The opposite index should be `len - 1 - i`.',
    ],
  },

  // 15. C Algorithmic
  {
    id: 'ch-c-3',
    title: 'Sorted Array Merge Pointer Arithmetic Bug',
    slug: 'c-sorted-array-merge-pointer-bug',
    language: 'c',
    difficulty: 'hard',
    category: 'algorithmic',
    xp_reward: 50,
    description: `Merging two sorted arrays into a new sorted array is an essential sub-routine in merge sort.
This C implementation contains a pointer arithmetic and index boundary bug where the remaining elements from the second array are completely ignored or overrun!

Fix the merge function so that \`merged\` contains all elements from \`a\` and \`b\` in ascending order.`,
    broken_code: `#include <stdio.h>
#include <stdlib.h>

void merge_sorted(int* a, int n, int* b, int m, int* out) {
    int i = 0, j = 0, k = 0;
    while (i < n && j < m) {
        if (a[i] <= b[j]) {
            out[k++] = a[i++];
        } else {
            out[k++] = b[j++];
        }
    }
    // BUG: Missing the loop to drain remaining elements from array b!
    while (i < n) {
        out[k++] = a[i++];
    }
}

int main() {
    int n, m;
    if (scanf("%d %d", &n, &m) == 2) {
        int a[100], b[100], out[200];
        for (int i = 0; i < n; i++) scanf("%d", &a[i]);
        for (int j = 0; j < m; j++) scanf("%d", &b[j]);
        merge_sorted(a, n, b, m, out);
        for (int k = 0; k < n + m; k++) {
            printf("%d%s", out[k], (k == n + m - 1) ? "" : " ");
        }
        printf("\n");
    }
    return 0;
}
`,
    correct_solution: `#include <stdio.h>
#include <stdlib.h>

void merge_sorted(int* a, int n, int* b, int m, int* out) {
    int i = 0, j = 0, k = 0;
    while (i < n && j < m) {
        if (a[i] <= b[j]) {
            out[k++] = a[i++];
        } else {
            out[k++] = b[j++];
        }
    }
    while (i < n) {
        out[k++] = a[i++];
    }
    while (j < m) {
        out[k++] = b[j++];
    }
}

int main() {
    int n, m;
    if (scanf("%d %d", &n, &m) == 2) {
        int a[100], b[100], out[200];
        for (int i = 0; i < n; i++) scanf("%d", &a[i]);
        for (int j = 0; j < m; j++) scanf("%d", &b[j]);
        merge_sorted(a, n, b, m, out);
        for (int k = 0; k < n + m; k++) {
            printf("%d%s", out[k], (k == n + m - 1) ? "" : " ");
        }
        printf("\n");
    }
    return 0;
}
`,
    hints: [
      'Remember that when the first `while (i < n && j < m)` finishes, either array `a` OR array `b` may still have remaining items.',
      'Add `while (j < m) { out[k++] = b[j++]; }` after the loop for `a`.',
    ],
  },

  // 16. Python Algorithmic
  {
    id: 'ch-py-5',
    title: 'Valid Parentheses Stack Underflow',
    slug: 'python-valid-parentheses-stack-underflow',
    language: 'python',
    difficulty: 'hard',
    category: 'algorithmic',
    xp_reward: 50,
    description: `Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
An input string is valid if open brackets are closed by the same type of brackets in the correct order.

The broken implementation crashes with \`IndexError: pop from empty list\` whenever a closing bracket appears before an opening bracket, and fails to check if unclosed brackets remain on the stack at the end!`,
    broken_code: `import sys

def is_valid_parentheses(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            # BUG: Pops without checking if stack is empty, causing IndexError!
            top = stack.pop()
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
            
    # BUG: Returns True even if there are unclosed brackets left on the stack!
    return True

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    print(is_valid_parentheses(raw))
`,
    correct_solution: `import sys

def is_valid_parentheses(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack:
                return False
            top = stack.pop()
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
            
    return len(stack) == 0

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    print(is_valid_parentheses(raw))
`,
    hints: [
      'Before calling `stack.pop()`, check `if not stack: return False` to prevent an IndexError when seeing an unexpected closing bracket.',
      'At the end of processing the string, return `len(stack) == 0` instead of unconditionally returning `True`.',
    ],
  },
];

export const INITIAL_TEST_CASES: TestCaseSeed[] = [
  // ch-py-1 (Palindrome)
  { id: 'tc-py-1-1', challenge_id: 'ch-py-1', input: 'racecar', expected_output: 'True', is_hidden: false, order_num: 1 },
  { id: 'tc-py-1-2', challenge_id: 'ch-py-1', input: 'Madam', expected_output: 'True', is_hidden: false, order_num: 2 },
  { id: 'tc-py-1-3', challenge_id: 'ch-py-1', input: 'bughunt', expected_output: 'False', is_hidden: true, order_num: 3 },
  { id: 'tc-py-1-4', challenge_id: 'ch-py-1', input: 'Level', expected_output: 'True', is_hidden: true, order_num: 4 },

  // ch-py-2 (Chunk list)
  { id: 'tc-py-2-1', challenge_id: 'ch-py-2', input: '{"arr": [1, 2, 3, 4, 5], "size": 2}', expected_output: '[[1, 2], [3, 4], [5]]', is_hidden: false, order_num: 1 },
  { id: 'tc-py-2-2', challenge_id: 'ch-py-2', input: '{"arr": [10, 20, 30], "size": 3}', expected_output: '[[10, 20, 30]]', is_hidden: false, order_num: 2 },
  { id: 'tc-py-2-3', challenge_id: 'ch-py-2', input: '{"arr": [1, 2, 3, 4, 5, 6, 7], "size": 3}', expected_output: '[[1, 2, 3], [4, 5, 6], [7]]', is_hidden: true, order_num: 3 },
  { id: 'tc-py-2-4', challenge_id: 'ch-py-2', input: '{"arr": [], "size": 2}', expected_output: '[]', is_hidden: true, order_num: 4 },

  // ch-py-3 (Grade Average)
  { id: 'tc-py-3-1', challenge_id: 'ch-py-3', input: '{"name": "Alice", "scores": [90, 85, 95]}', expected_output: '90.0', is_hidden: false, order_num: 1 },
  { id: 'tc-py-3-2', challenge_id: 'ch-py-3', input: '{"name": "Bob", "scores": []}', expected_output: '0.0', is_hidden: false, order_num: 2 },
  { id: 'tc-py-3-3', challenge_id: 'ch-py-3', input: '{"name": "Charlie"}', expected_output: '0.0', is_hidden: true, order_num: 3 },
  { id: 'tc-py-3-4', challenge_id: 'ch-py-3', input: '{"name": "Dave", "scores": [73, 84, 91, 68]}', expected_output: '79.0', is_hidden: true, order_num: 4 },

  // ch-py-4 (Binary Search)
  { id: 'tc-py-4-1', challenge_id: 'ch-py-4', input: '{"arr": [1, 3, 5, 7, 9, 11], "target": 7}', expected_output: '3', is_hidden: false, order_num: 1 },
  { id: 'tc-py-4-2', challenge_id: 'ch-py-4', input: '{"arr": [2, 4, 6, 8, 10], "target": 5}', expected_output: '-1', is_hidden: false, order_num: 2 },
  { id: 'tc-py-4-3', challenge_id: 'ch-py-4', input: '{"arr": [10, 20, 30, 40], "target": 10}', expected_output: '0', is_hidden: true, order_num: 3 },
  { id: 'tc-py-4-4', challenge_id: 'ch-py-4', input: '{"arr": [10, 20, 30, 40], "target": 40}', expected_output: '3', is_hidden: true, order_num: 4 },

  // ch-js-1 (Currency Formatter)
  { id: 'tc-js-1-1', challenge_id: 'ch-js-1', input: '{"amount": 12.5, "symbol": "$"}', expected_output: '$12.50', is_hidden: false, order_num: 1 },
  { id: 'tc-js-1-2', challenge_id: 'ch-js-1', input: '{"amount": 0, "symbol": "€"}', expected_output: '€0.00', is_hidden: false, order_num: 2 },
  { id: 'tc-js-1-3', challenge_id: 'ch-js-1', input: '{"amount": 99.999, "symbol": "£"}', expected_output: '£100.00', is_hidden: true, order_num: 3 },
  { id: 'tc-js-1-4', challenge_id: 'ch-js-1', input: '{"amount": "abc", "symbol": "$"}', expected_output: 'Invalid Amount', is_hidden: true, order_num: 4 },

  // ch-js-2 (Closure Loop)
  { id: 'tc-js-2-1', challenge_id: 'ch-js-2', input: '{"count": 3, "multiplier": 5}', expected_output: '[0,5,10]', is_hidden: false, order_num: 1 },
  { id: 'tc-js-2-2', challenge_id: 'ch-js-2', input: '{"count": 4, "multiplier": 2}', expected_output: '[0,2,4,6]', is_hidden: false, order_num: 2 },
  { id: 'tc-js-2-3', challenge_id: 'ch-js-2', input: '{"count": 1, "multiplier": 10}', expected_output: '[0]', is_hidden: true, order_num: 3 },

  // ch-js-3 (Optional chaining / deep property)
  { id: 'tc-js-3-1', challenge_id: 'ch-js-3', input: '{"profile": {"address": {"country": {"code": "us"}}}}', expected_output: 'US', is_hidden: false, order_num: 1 },
  { id: 'tc-js-3-2', challenge_id: 'ch-js-3', input: '{"profile": {}}', expected_output: 'UNKNOWN', is_hidden: false, order_num: 2 },
  { id: 'tc-js-3-3', challenge_id: 'ch-js-3', input: '{}', expected_output: 'UNKNOWN', is_hidden: true, order_num: 3 },
  { id: 'tc-js-3-4', challenge_id: 'ch-js-3', input: '{"profile": {"address": {"country": {"code": "jp"}}}}', expected_output: 'JP', is_hidden: true, order_num: 4 },

  // ch-js-4 (Two Sum)
  { id: 'tc-js-4-1', challenge_id: 'ch-js-4', input: '{"nums": [2, 7, 11, 15], "target": 9}', expected_output: '[0,1]', is_hidden: false, order_num: 1 },
  { id: 'tc-js-4-2', challenge_id: 'ch-js-4', input: '{"nums": [3, 2, 4], "target": 6}', expected_output: '[1,2]', is_hidden: false, order_num: 2 },
  { id: 'tc-js-4-3', challenge_id: 'ch-js-4', input: '{"nums": [3, 3], "target": 6}', expected_output: '[0,1]', is_hidden: true, order_num: 3 },
  { id: 'tc-js-4-4', challenge_id: 'ch-js-4', input: '{"nums": [1, 2, 3], "target": 10}', expected_output: '[]', is_hidden: true, order_num: 4 },

  // ch-java-1 (Temperature Converter)
  { id: 'tc-java-1-1', challenge_id: 'ch-java-1', input: '0.0', expected_output: '32.0', is_hidden: false, order_num: 1 },
  { id: 'tc-java-1-2', challenge_id: 'ch-java-1', input: '100.0', expected_output: '212.0', is_hidden: false, order_num: 2 },
  { id: 'tc-java-1-3', challenge_id: 'ch-java-1', input: '37.0', expected_output: '98.6', is_hidden: true, order_num: 3 },

  // ch-java-2 (String equality)
  { id: 'tc-java-2-1', challenge_id: 'ch-java-2', input: 'BUGHUNT_SECRET_2026', expected_output: 'true', is_hidden: false, order_num: 1 },
  { id: 'tc-java-2-2', challenge_id: 'ch-java-2', input: 'WRONG_SECRET', expected_output: 'false', is_hidden: false, order_num: 2 },
  { id: 'tc-java-2-3', challenge_id: 'ch-java-2', input: 'bughunt_secret_2026', expected_output: 'false', is_hidden: true, order_num: 3 },

  // ch-java-3 (Array reverse)
  { id: 'tc-java-3-1', challenge_id: 'ch-java-3', input: '4 1 2 3 4', expected_output: '[4, 3, 2, 1]', is_hidden: false, order_num: 1 },
  { id: 'tc-java-3-2', challenge_id: 'ch-java-3', input: '5 10 20 30 40 50', expected_output: '[50, 40, 30, 20, 10]', is_hidden: false, order_num: 2 },
  { id: 'tc-java-3-3', challenge_id: 'ch-java-3', input: '1 99', expected_output: '[99]', is_hidden: true, order_num: 3 },

  // ch-java-4 (Fibonacci)
  { id: 'tc-java-4-1', challenge_id: 'ch-java-4', input: '0', expected_output: '0', is_hidden: false, order_num: 1 },
  { id: 'tc-java-4-2', challenge_id: 'ch-java-4', input: '7', expected_output: '13', is_hidden: false, order_num: 2 },
  { id: 'tc-java-4-3', challenge_id: 'ch-java-4', input: '10', expected_output: '55', is_hidden: true, order_num: 3 },
  { id: 'tc-java-4-4', challenge_id: 'ch-java-4', input: '30', expected_output: '832040', is_hidden: true, order_num: 4 },

  // ch-c-1 (C Factorial)
  { id: 'tc-c-1-1', challenge_id: 'ch-c-1', input: '5', expected_output: '120', is_hidden: false, order_num: 1 },
  { id: 'tc-c-1-2', challenge_id: 'ch-c-1', input: '1', expected_output: '1', is_hidden: false, order_num: 2 },
  { id: 'tc-c-1-3', challenge_id: 'ch-c-1', input: '6', expected_output: '720', is_hidden: true, order_num: 3 },

  // ch-c-2 (C String Reverse)
  { id: 'tc-c-2-1', challenge_id: 'ch-c-2', input: 'hello', expected_output: 'olleh', is_hidden: false, order_num: 1 },
  { id: 'tc-c-2-2', challenge_id: 'ch-c-2', input: 'BugHunt', expected_output: 'tnuHguB', is_hidden: false, order_num: 2 },
  { id: 'tc-c-2-3', challenge_id: 'ch-c-2', input: 'a', expected_output: 'a', is_hidden: true, order_num: 3 },

  // ch-c-3 (C Merge Sorted)
  { id: 'tc-c-3-1', challenge_id: 'ch-c-3', input: '3 3 1 3 5 2 4 6', expected_output: '1 2 3 4 5 6', is_hidden: false, order_num: 1 },
  { id: 'tc-c-3-2', challenge_id: 'ch-c-3', input: '2 1 10 20 15', expected_output: '10 15 20', is_hidden: false, order_num: 2 },
  { id: 'tc-c-3-3', challenge_id: 'ch-c-3', input: '1 2 5 1 2', expected_output: '1 2 5', is_hidden: true, order_num: 3 },

  // ch-py-5 (Parentheses)
  { id: 'tc-py-5-1', challenge_id: 'ch-py-5', input: '()[]{}', expected_output: 'True', is_hidden: false, order_num: 1 },
  { id: 'tc-py-5-2', challenge_id: 'ch-py-5', input: '(]', expected_output: 'False', is_hidden: false, order_num: 2 },
  { id: 'tc-py-5-3', challenge_id: 'ch-py-5', input: '([{}])', expected_output: 'True', is_hidden: true, order_num: 3 },
  { id: 'tc-py-5-4', challenge_id: 'ch-py-5', input: '((()', expected_output: 'False', is_hidden: true, order_num: 4 },
  { id: 'tc-py-5-5', challenge_id: 'ch-py-5', input: ']', expected_output: 'False', is_hidden: true, order_num: 5 },
];
