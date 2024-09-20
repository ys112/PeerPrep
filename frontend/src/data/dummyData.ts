import { Question } from "../types/question";

export const dummyData: Question[] = [
  {
    id: 1,
    title: "Reverse a String",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    categories: "Strings, Algorithms",
    complexity: "Easy",
    link: "https://leetcode.com/problems/reverse-string/",
  },
  {
    id: 2,
    title: "Linked List Cycle Detection",
    description:
      "Implement a function to detect if a linked list contains a cycle.",
    categories: "Data Structures, Algorithms",
    complexity: "Easy",
    link: "https://leetcode.com/problems/linked-list-cycle/",
  },
  {
    id: 3,
    title: "Roman to Integer",
    description: "Given a roman numeral, convert it to an integer.",
    categories: "Algorithms",
    complexity: "Easy",
    link: "https://leetcode.com/problems/roman-to-integer/",
  },
  {
    id: 4,
    title: "Add Binary",
    description:
      "Given two binary strings a and b, return their sum as a binary string.",
    categories: "Bit Manipulation, Algorithms",
    complexity: "Easy",
    link: "https://leetcode.com/problems/add-binary/",
  },
  {
    id: 5,
    title: "Fibonacci Number",
    description:
      "The Fibonacci numbers form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
    categories: "Recursion, Algorithms",
    complexity: "Easy",
    link: "https://leetcode.com/problems/fibonacci-number/",
  },
  {
    id: 6,
    title: "Implement Stack using Queues",
    description:
      "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).",
    categories: "Data Structures",
    complexity: "Easy",
    link: "https://leetcode.com/problems/implement-stack-using-queues/",
  },
  {
    id: 7,
    title: "Combine Two Tables",
    description:
      "Given table Person with the following columns: 1. personId (int), 2. lastName (varchar), 3. firstName (varchar). personId is the primary key. And table Address with the following columns: 1. addressId (int), 2. personId (int), 3. city (varchar), 4. state (varchar). Write a solution to report the first name, last name, city, and state of each person in the Person table.",
    categories: "Databases",
    complexity: "Easy",
    link: "https://leetcode.com/problems/combine-two-tables/",
  },
  {
    id: 8,
    title: "Repeated DNA Sequences",
    description:
      "The DNA sequence is composed of a series of nucleotides abbreviated as 'A', 'C', 'G', and 'T'. Given a string s that represents a DNA sequence, return all 10-letter-long sequences that occur more than once in a DNA molecule.",
    categories: "Algorithms, Bit Manipulation",
    complexity: "Medium",
    link: "https://leetcode.com/problems/repeated-dna-sequences/",
  },
  {
    id: 9,
    title: "Course Schedule",
    description:
      "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses.",
    categories: "Data Structures, Algorithms",
    complexity: "Medium",
    link: "https://leetcode.com/problems/course-schedule/",
  },
  {
    id: 10,
    title: "LRU Cache Design",
    description: "Design and implement an LRU (Least Recently Used) cache.",
    categories: "Data Structures",
    complexity: "Medium",
    link: "https://leetcode.com/problems/lru-cache/",
  },
  {
    id: 11,
    title: "Longest Common Subsequence",
    description:
      "Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence of a string is a new string generated from the original string with some characters deleted without changing the relative order of the remaining characters.",
    categories: "Strings, Algorithms",
    complexity: "Medium",
    link: "https://leetcode.com/problems/longest-common-subsequence/",
  },
  {
    id: 12,
    title: "Rotate Image",
    description:
      "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",
    categories: "Arrays, Algorithms",
    complexity: "Medium",
    link: "https://leetcode.com/problems/rotate-image/",
  },
  {
    id: 13,
    title: "Airplane Seat Assignment Probability",
    description:
      "n passengers board an airplane with exactly n seats. The first passenger picks a seat randomly. The rest take their own seat if available, or pick other seats randomly. Return the probability that the nth person gets their own seat.",
    categories: "Brainteaser",
    complexity: "Medium",
    link: "https://leetcode.com/problems/airplane-seat-assignment-probability/",
  },
  {
    id: 14,
    title: "Validate Binary Search Tree",
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    categories: "Data Structures, Algorithms",
    complexity: "Medium",
    link: "https://leetcode.com/problems/validate-binary-search-tree/",
  },
  {
    id: 15,
    title: "Sliding Window Maximum",
    description:
      "You are given an array of integers nums, with a sliding window of size k moving from the left to the right. Return the max sliding window.",
    categories: "Arrays, Algorithms",
    complexity: "Hard",
    link: "https://leetcode.com/problems/sliding-window-maximum/",
  },
  {
    id: 16,
    title: "N-Queen Problem",
    description:
      "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.",
    categories: "Algorithms",
    complexity: "Hard",
    link: "https://leetcode.com/problems/n-queens/",
  },
  {
    id: 17,
    title: "Serialize and Deserialize a Binary Tree",
    description:
      "Serialization is the process of converting a data structure or object into a sequence of bits. Design an algorithm to serialize and deserialize a binary tree.",
    categories: "Data Structures, Algorithms",
    complexity: "Hard",
    link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
  },
  {
    id: 18,
    title: "Wildcard Matching",
    description:
      "Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*'.",
    categories: "Strings, Algorithms",
    complexity: "Hard",
    link: "https://leetcode.com/problems/wildcard-matching/",
  },
  {
    id: 19,
    title: "Chalkboard XOR Game",
    description:
      "You are given an array of integers nums. Alice and Bob take turns erasing exactly one number from the chalkboard. If erasing a number causes the bitwise XOR of all the elements to become 0, that player loses. Return true if Alice wins the game assuming both play optimally.",
    categories: "Brainteaser",
    complexity: "Hard",
    link: "https://leetcode.com/problems/chalkboard-xor-game/",
  },
  {
    id: 20,
    title: "Trips and Users",
    description:
      "Given tables Trips and Users, find the cancellation rate of requests with unbanned users each day between '2013-10-01' and '2013-10-03'.",
    categories: "Databases",
    complexity: "Hard",
    link: "https://leetcode.com/problems/trips-and-users/",
  },
];
