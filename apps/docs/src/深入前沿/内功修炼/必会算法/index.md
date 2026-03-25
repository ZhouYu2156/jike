---
footer: false
---

# 必会算法

## LeetCode 热题 100

### 两数之和

> 在数组中寻找相加求和等于目标数的两个数的下标，如果有多个两数相加结果都等于目标数，只取一个结果即可。

::: details 具体代码
::: code-group

```js [暴力解法]
// 两层循环遍历 => 算法复杂度 O(n²)

function twoSum(nums, target) {
  if (nums.length === 0) return

  for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j]
      }
    }
  }
}

console.log(twoSum([0, 1, 5, 7, 8, 9, 4, 3], 8))
```

```js [优化算法]
// 利用哈希表优化 => 算法复杂度 O(n)

function twoSum(nums: number[], target: number) {
  const map = new Map<number, number>()

  for (let i = 0; i <= nums.length; i++) {
    const diff = target - nums[i]

    if (map.has(diff)) return [map.get(diff) as number, i]

    map.set(nums[i], i)
  }

  return []
}

console.log(twoSum([0, 1, 5, 7, 8, 9, 4, 3], 8))
```

:::

### 字母异位词分组

> 将一个字符串数组中的字母异位单词，按照全部由相同字母组合的进行归类。

::: details 具体代码

```js
/**
 * 巧妙将字母异位的字符串转换为数组，字母经过排序得到相同顺序，把排序后的字符串作为键，值为数组，将相同的字母的异位词放入数组中。
 * @param {Array<string>} strs 字母异位词
 */
function groupAnagrams(strs: string[]) {
  const map = new Map<string, string[]>()

  for (let str of strs) {
    let arr = Array.from(str)

    arr.sort()

    let key = arr.toString()

    let list: string[] = (map.get(key) ? map.get(key) : new Array<string>()) as string[]

    list.push(str)

    map.set(key, list)
  }
  return Array.from<string[]>(map.values())
}
```

:::

### 最长连续序列

> 求出数组中连续序列最大的长度。

::: details 具体代码

```js
function longestConsecutive(nums: number[]) {
  if (nums.length === 0) return 0
  // 去重
  let arr = new Set(nums)
  nums = Array.from(arr)
  /** sort 方法默认按照字符串排序， 必须要传入一个模板函数 */
  nums.sort((a, b) => a - b)

  // 如果数组中有数字，则连续序列至少从 1 开始
  let count = 1
  let result = 1

  for (let i = 0; i <= nums.length - 1; i++) {
    if (nums[i + 1] - nums[i] === 1) count++
    else {
      if (count > result) result = count
      count = 1
    }
  }

  return result
}

console.log(longestConsecutive([0, 3, 7, 7, 7, 2, 5, 4, 1, 9, 8, 10, 12, 11, 15, 14, 13, 18, 17, 16, 21, 25]))
```

:::

### 移动零

::: details 具体代码

```js
// 双指针，前后控制是否交换 => 时间复杂度 O(n)
function moveZeroes(nums: number[]) {
  let left = 0,
    right = 0
  while (right < nums.length) {
    if (nums[right] !== 0) {
      ;[nums[left], nums[right]] = [nums[right], nums[left]]
      left++
    }
    right++
  }

  return nums
}
console.log(moveZeroes([0, 1, 0, 3, 12]))
```

:::

## 其他算法

### 斐波那契数列

::: details 具体代码
::: code-group

```ts [朴素递归实现]
// 无缓存，直接硬递归 => 时间复杂度 O(2的n次幂），空间复杂度取决于递归调用栈的深度
function fabbonacci(n: number): number {
  if (n === 1 || n === 2) return 1

  return fabbonacci(n - 1) + fabbonacci(n - 2)
}

console.log(fabbonacci(10))
```

```ts [迭代版]
// 线性递归 => 时间复杂度 O(n)，空间复杂度 O(1)
function fabbonacci(n: number) {
  if (n <= 1 || n === 2) return 1

  let a = 1,
    b = 1
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b]
  return a
}

console.log(fabbonacci(10))
```

```ts [迭代器版]
// 线性迭代 => 时间复杂度 O(1)，空间复杂度 O(1)
function* fabbonacci() {
  let a = 0,
    b = 1

  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

const gen = fabbonacci()

const result = Array.from({ length: 10 }, () => gen.next().value)

console.log(gen)
```

:::
