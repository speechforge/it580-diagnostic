import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Award,
  ChevronRight,
  Printer,
  BarChart2,
  GraduationCap,
  Flame,
  Lightbulb,
  Lock,
  LogOut,
  Phone,
  UserCheck,
  ShieldCheck,
  FileQuestion,
  ChevronDown,
  Layers,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/ThemeToggle';
import rawData from '@/data/analysisData.json';
import { AnalysisDataset, StudentAnalysisRecord } from '@/data/analysisTypes';

const data = rawData as unknown as AnalysisDataset;

// Comprehensive pedagogical study points for each chapter
const CHAPTER_STUDY_GUIDE: Record<number, {
  chapterTitle: string;
  moduleName: string;
  keyPointsToLearnFirst: string[];
  commonExamTraps: string[];
  keyFormulaOrRecurrence: string;
}> = {
  5: {
    chapterTitle: "Chapter 5: Binary Search Trees (BST)",
    moduleName: "Trees & Search Structures",
    keyPointsToLearnFirst: [
      "BST Invariant: For every node, all keys in left subtree are strictly < node.key, and all keys in right subtree are strictly > node.key.",
      "Recursive Range Validation: Checking only immediate children (left < root < right) is INCORRECT. Valid intervals (minVal, maxVal) passed from ancestors must be checked recursively.",
      "In-Order Traversal Invariant: In-order traversal (Left -> Root -> Right) of any valid BST always visits keys in strictly ascending sorted order.",
      "K-th Smallest Element: Perform in-order traversal using an explicit stack; return the k-th popped node in O(H + k) time without sorting the whole tree.",
      "Minimum Absolute Difference: Guaranteed to occur between two adjacent keys in the in-order sorted sequence."
    ],
    commonExamTraps: [
      "Assuming a node is valid if it is greater than its left child and less than its right child (it must satisfy all ancestor bounds).",
      "Confusing in-order with pre-order (Root -> Left -> Right) or level-order traversal."
    ],
    keyFormulaOrRecurrence: "Valid Left Child: bound ∈ (low, curr.val) | Valid Right Child: bound ∈ (curr.val, high)"
  },
  6: {
    chapterTitle: "Chapter 6: Graph Traversal & Minimum Spanning Trees",
    moduleName: "Graphs & Spanning Trees",
    keyPointsToLearnFirst: [
      "Graph Representations: Adjacency Matrix uses O(V²) memory and O(1) edge lookup; Adjacency List uses O(V + E) memory and O(deg(v)) iteration. Sparse graphs (E ≪ V²) require Adjacency List.",
      "BFS for Shortest Paths: In unweighted graphs, BFS with a FIFO queue guarantees that the first time a vertex is reached, the path length is minimal.",
      "Connected Components: Each traversal sweep (DFS or BFS) initiated from an unvisited vertex discovers one full connected component.",
      "MST Cut Property: For any partition cut (S, V \\ S), the minimum-weight crossing edge belongs to some MST. If edge weights are distinct, the MST is strictly unique.",
      "Kruskal vs Prim: Kruskal sorts edges O(E log E) and merges components using DSU with path compression. Prim grows a single tree using a min-heap O((V + E) log V)."
    ],
    commonExamTraps: [
      "Confusing an MST (minimizes total weight of all edges) with a Shortest Path Tree (minimizes distance from a single source).",
      "Forgetting path compression in Disjoint Set Union (DSU) which reduces find() runtime to near O(α(V))."
    ],
    keyFormulaOrRecurrence: "Spanning Tree Invariant: Exactly V - 1 edges with 0 cycles for any connected graph with V vertices."
  },
  7: {
    chapterTitle: "Chapter 7: Heaps & Priority Queues",
    moduleName: "Priority Queues & Selection",
    keyPointsToLearnFirst: [
      "Binary Heap Structure: Complete binary tree stored in array: parent(i) = (i - 1) // 2, left(i) = 2i + 1, right(i) = 2i + 2.",
      "K-th Largest Element: Maintain a MIN-heap of size k. Push new items and pop root if size > k. The root is the k-th largest element in O(N log k) time.",
      "Heapify Linear Time: Building a heap bottom-up takes linear O(N) time through mathematical summation of heights, NOT O(N log N).",
      "Simulation Problems (Last Stone Weight): Repeatedly pop the two heaviest stones using a Max-Heap; reinsert positive difference y - x.",
      "Top K Frequent Elements: Count frequencies with hash map; maintain min-heap of size k keyed by frequency."
    ],
    commonExamTraps: [
      "Using a Max-Heap of size N (O(N log N)) when finding the K-th largest, instead of a Min-Heap of size k (O(N log k)).",
      "Assuming a binary heap is fully sorted (in a heap, left child is NOT necessarily smaller or larger than right child)."
    ],
    keyFormulaOrRecurrence: "Max-Heap: parent >= children | Min-Heap: parent <= children | Insert/Delete: O(log N)"
  },
  8: {
    chapterTitle: "Chapter 8: Greedy Algorithms",
    moduleName: "Greedy Strategy & Invariants",
    keyPointsToLearnFirst: [
      "Greedy-Choice Property: A locally optimal choice at each step leads to a globally optimal solution without backtracking. Must prove via exchange argument.",
      "Assign Cookies: Sort children greed and cookie sizes; match smallest satisfying cookie to each child using two pointers in O(N log N + M log M).",
      "Jump Game Reachability: Greedily track max_reach = max(max_reach, i + nums[i]). If at any step i > max_reach, return false.",
      "Lemonade Change: When making change for $20, greedily dispense one $10 and one $5 bill before dispensing three $5 bills, preserving versatile $5 bills.",
      "Marc's Cakewalk: Sort calories descending so largest calories get smallest powers of 2: sum(c[i] * 2^i)."
    ],
    commonExamTraps: [
      "Applying greedy logic to problems with non-greedy optimal substructure (e.g. 0/1 knapsack where value/weight heuristic fails).",
      "Dispensing $5 bills first in Lemonade Change, leaving the cashier unable to give change to subsequent $10 customers."
    ],
    keyFormulaOrRecurrence: "Greedy Invariant: max_reach = max(max_reach, i + nums[i]) | If i > max_reach -> Unreachable"
  },
  9: {
    chapterTitle: "Chapter 9: Optimization Techniques: DP & Greedy",
    moduleName: "Dynamic Programming & Optimization",
    keyPointsToLearnFirst: [
      "DP Core Invariants: Requires overlapping subproblems and optimal substructure. Memoization (top-down) caches recursive calls; tabulation (bottom-up) fills tables iteratively.",
      "0/1 Knapsack 1D Space: dp[w] = max(dp[w], dp[w - wt] + val). Must iterate capacity w BACKWARDS from W down to wt to prevent reusing the same item.",
      "Longest Common Subsequence (LCS): If s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1]).",
      "Longest Common Substring: Resets to 0 immediately when characters do not match because substring must be contiguous.",
      "Partition Equal Subset Sum: If total sum is odd, return false immediately; otherwise solve 0/1 knapsack for target = sum / 2."
    ],
    commonExamTraps: [
      "Iterating capacity forwards in 1D knapsack, which accidentally turns 0/1 knapsack into unbounded knapsack with multiple item reuse.",
      "Confusing subsequence (relative order preserved, non-contiguous) with substring (strictly contiguous)."
    ],
    keyFormulaOrRecurrence: "0/1 Knapsack 1D: for w in range(W, wt - 1, -1): dp[w] = max(dp[w], dp[w - wt] + val)"
  },
  10: {
    chapterTitle: "Chapter 10: Revision Multi-Paradigm Exam",
    moduleName: "Comprehensive Revision",
    keyPointsToLearnFirst: [
      "Min-Cost Staircase DP: dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Can start at step 0 or 1 with zero prior cost; top floor is min(dp[n-1], dp[n-2]).",
      "Edit Distance (Levenshtein): If s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1]; else 1 + min(insert: dp[i][j-1], delete: dp[i-1][j], replace: dp[i-1][j-1]).",
      "Dijkstra's Algorithm: Single-source shortest path on non-negative weighted graphs using min-heap in O((V + E) log V). Max delay is max(dist[1..N]).",
      "Floyd-Warshall All-Pairs: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]). Intermediate vertex k loop MUST be outermost.",
      "BFS in Binary Matrix: First time queue reaches target (N-1, N-1) is guaranteed shortest path; mark visited immediately upon enqueue."
    ],
    commonExamTraps: [
      "Placing intermediate vertex k loop inside the i, j loops in Floyd-Warshall, breaking DP intermediate-state invariants.",
      "Running Dijkstra on graphs with negative edge weights (requires Bellman-Ford)."
    ],
    keyFormulaOrRecurrence: "Staircase: dp[i] = cost[i] + min(dp[i-1], dp[i-2]) | Floyd: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])"
  },
  11: {
    chapterTitle: "Chapter 11: Dynamic Programming (Matrix Chain & Fibonacci)",
    moduleName: "Matrix Chain & Linear DP",
    keyPointsToLearnFirst: [
      "Matrix Chain Multiplication: Multiplications depend heavily on parenthesization. Optimal split point k minimizes cost.",
      "Recurrence Relation: m[i][j] = min_{i<=k<j} (m[i][k] + m[k+1][j] + p[i-1] * p[k] * p[j]) with base case m[i][i] = 0.",
      "Chain Length Order: Table must be filled by chain length L = 2 to n. Overall runtime is O(N^3) time and O(N^2) space.",
      "Fibonacci DP Recurrence: F[n] = F[n-1] + F[n-2] with F[0] = 0, F[1] = 1. Iterative tabulation takes O(N) time and O(1) space.",
      "64-Bit Integer Limits: F[92] is the maximum Fibonacci number that fits within a signed 64-bit integer (`long long`). F[93] causes 64-bit overflow."
    ],
    commonExamTraps: [
      "Multiplying matrix dimensions directly without finding the optimal split point k that minimizes scalar operations.",
      "Using standard 32-bit integer for Fibonacci calculation, which overflows at F[47]."
    ],
    keyFormulaOrRecurrence: "m[i][j] = min_{i<=k<j} (m[i][k] + m[k+1][j] + p[i-1]*p[k]*p[j]) | Fits in int64 up to F[92]"
  },
  12: {
    chapterTitle: "Chapter 12: Network Flow & Residual Graphs",
    moduleName: "Network Flow & Min-Cut",
    keyPointsToLearnFirst: [
      "Flow Constraints: Capacity constraint (0 <= f(e) <= c(e)) and Flow conservation (incoming flow equals outgoing flow for all u != s, t).",
      "Residual Graph: Forward residual capacity c_f(u, v) = c(u, v) - f(u, v). Backward residual capacity c_f(v, u) = f(u, v) allows cancelling previously pushed flow.",
      "Edmonds-Karp Algorithm: Implements Ford-Fulkerson using BFS (shortest augmenting path in edge count). Guarantees polynomial runtime O(V * E^2).",
      "Max-Flow Min-Cut Theorem: The maximum volume of flow from source s to sink t equals the minimum capacity among all s-t cuts.",
      "Cut Capacity Calculation: Capacity of cut (S, T) is the sum of capacities of edges directed strictly from S to T (edges from T to S are NOT counted)."
    ],
    commonExamTraps: [
      "Omitting backward residual edges, which traps the algorithm in suboptimal paths and prevents finding maximum flow.",
      "Including reverse edges directed from T to S when computing s-t cut capacity."
    ],
    keyFormulaOrRecurrence: "Forward residual: c(u,v) - f(u,v) | Backward residual: f(u,v) | Max-Flow = Min-Cut Capacity"
  }
};

export default function Analysis() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Authentication state
  const [enteredContact, setEnteredContact] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [detectedStudent, setDetectedStudent] = useState<StudentAnalysisRecord | null>(null);

  const [authenticatedStudentId, setAuthenticatedStudentId] = useState<string | null>(() => {
    const saved = sessionStorage.getItem('it580_auth_student_id');
    if (saved && data.students.some(s => s.studentId === saved)) {
      return saved;
    }
    const urlId = searchParams.get('id');
    if (urlId && data.students.some(s => s.studentId === urlId) && sessionStorage.getItem(`auth_${urlId}`) === 'true') {
      return urlId;
    }
    return null;
  });

  // Selected chapter for drilling into questions (null = viewing chapters & study guide)
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number | null>(null);

  // Auto-authenticate or prefill if ?phone=... or ?id=... is in URL
  useEffect(() => {
    const urlPhone = searchParams.get('phone');
    const urlId = searchParams.get('id');
    const query = (urlPhone || urlId || '').trim();

    if (query) {
      const cleanQ = query.replace(/[^0-9]/g, '');
      const match = data.students.find(s => {
        const cleanPhone = (s.cleanContact || '').trim();
        const idMatch = query === s.studentId;
        const phoneMatch = cleanQ.length >= 7 && (cleanPhone === cleanQ || cleanPhone.endsWith(cleanQ));
        return phoneMatch || idMatch;
      });

      if (match) {
        setEnteredContact(query);
        setDetectedStudent(match);
        setAuthenticatedStudentId(match.studentId);
        sessionStorage.setItem('it580_auth_student_id', match.studentId);
      }
    }
  }, [searchParams]);

  // Auto-detect student as user types phone number or student ID
  const handleInputChange = (value: string) => {
    setEnteredContact(value);
    setAuthError('');

    const cleanInput = value.trim().replace(/[^0-9]/g, '');
    const rawInput = value.trim();

    if (cleanInput.length >= 7 || rawInput.length >= 7) {
      const match = data.students.find(s => {
        const cleanPhone = (s.cleanContact || '').trim();
        const idMatch = rawInput === s.studentId;
        const phoneMatch = cleanInput.length >= 7 && (cleanPhone === cleanInput || cleanPhone.endsWith(cleanInput));
        return phoneMatch || idMatch;
      });
      if (match) {
        setDetectedStudent(match);
      } else {
        setDetectedStudent(null);
      }
    } else {
      setDetectedStudent(null);
    }
  };

  // Login handler
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');

    const cleanInput = enteredContact.trim().replace(/[^0-9]/g, '');
    const rawInput = enteredContact.trim();

    if (!rawInput) {
      setAuthError('Please enter your registered contact phone number or Student ID.');
      return;
    }

    const targetStudent = detectedStudent || data.students.find(s => {
      const cleanPhone = (s.cleanContact || '').trim();
      const idMatch = rawInput === s.studentId;
      const phoneMatch = cleanInput.length >= 7 && (cleanPhone === cleanInput || cleanPhone.endsWith(cleanInput));
      return phoneMatch || idMatch;
    });

    if (targetStudent) {
      setAuthenticatedStudentId(targetStudent.studentId);
      sessionStorage.setItem('it580_auth_student_id', targetStudent.studentId);
      sessionStorage.setItem(`auth_${targetStudent.studentId}`, 'true');
      setSearchParams({ id: targetStudent.studentId });
      setSelectedChapterNumber(null);
    } else {
      setAuthError('No student record found matching this phone number. Please check your registered 10-digit number or enter your Student ID.');
    }
  };

  const handleLogout = () => {
    setAuthenticatedStudentId(null);
    sessionStorage.removeItem('it580_auth_student_id');
    setSearchParams({});
    setEnteredContact('');
    setAuthError('');
    setSelectedChapterNumber(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Current authenticated student object
  const currentStudent = useMemo(() => {
    if (!authenticatedStudentId) return null;
    return data.students.find(s => s.studentId === authenticatedStudentId) || null;
  }, [authenticatedStudentId]);

  // Questions for the currently selected chapter
  const currentChapterQuestions = useMemo(() => {
    if (!currentStudent || !selectedChapterNumber) return [];
    return currentStudent.wrongQuestions.filter(q => q.assignmentNumber === selectedChapterNumber);
  }, [currentStudent, selectedChapterNumber]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border shadow-xs print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-primary tracking-tight">
                  IT 580 Diagnostic Portal
                </span>
                <Badge variant="outline" className="text-xs font-semibold px-2 py-0 border-primary/30 text-primary">
                  Assignments 5–12
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden md:block">
                DA-IICT • Guided Concept Revision & Question Diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {currentStudent && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-1.5 text-xs hidden sm:flex"
                  title="Print or save PDF revision notes"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Export PDF</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                  title="Log out and return to student selection"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Switch Student</span>
                </Button>
              </>
            )}

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ============================================================== */}
        {/* PRIVACY AUTHENTICATION SCREEN (When not verified) */}
        {/* ============================================================== */}
        {!currentStudent ? (
          <div className="max-w-md mx-auto my-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 rounded-2xl bg-primary/10 items-center justify-center text-primary mb-1">
                <Lock className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                Student Diagnostic Access
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enter your registered contact phone number or Student ID to view your personalized revision plan and chapter study points.
              </p>
            </div>

            <Card className="border-border shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Enter Your Contact Phone Number
                </CardTitle>
                <CardDescription className="text-xs">
                  Enter your registered 10-digit mobile number or Student ID to access your diagnostic report.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Contact Number Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span>Registered Contact Number</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Enter your phone number (or Student ID)..."
                        value={enteredContact}
                        onChange={e => handleInputChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                        autoComplete="tel"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Dynamically Revealed Student Confirmation when phone number matches */}
                  {detectedStudent && (
                    <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 space-y-1 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Student Record Verified</span>
                      </div>
                      <p className="text-sm font-extrabold text-foreground">
                        {detectedStudent.fullName}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-0.5">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          ID: {detectedStudent.studentId}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {detectedStudent.course} • {detectedStudent.group}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Error display */}
                  {authError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{authError}</span>
                    </div>
                  )}

                  <Button type="submit" className="w-full gap-2 font-bold py-2.5">
                    <UserCheck className="h-4 w-4" />
                    <span>View My Diagnostic Report</span>
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground">
              DA-IICT IT 580: Data Structures & Algorithms • Assignments 5 to 12
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* AUTHENTICATED STUDENT DASHBOARD */
          /* ============================================================== */
          <div className="space-y-6 animate-in fade-in duration-300">

            {/* Overall Performance & Tier Status Card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xs relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Profile Info */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono px-2.5 py-0.5 border-primary/40 text-primary">
                      ID: {currentStudent.studentId}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {currentStudent.course} • {currentStudent.group}
                    </Badge>
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                      {currentStudent.fullName}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-0.5">
                      {currentStudent.email}
                    </p>
                  </div>

                  {/* Performance Tier Banner */}
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overall Tier:</span>
                    {currentStudent.overallStats.priority === 'HIGH' && (
                      <Badge className="bg-red-600 text-white gap-1.5 px-3 py-1 font-bold text-xs shadow-xs">
                        <Flame className="h-3.5 w-3.5" /> CRITICAL REVISION TIER
                      </Badge>
                    )}
                    {currentStudent.overallStats.priority === 'MEDIUM' && (
                      <Badge className="bg-amber-500 text-white gap-1.5 px-3 py-1 font-bold text-xs shadow-xs">
                        <AlertTriangle className="h-3.5 w-3.5" /> MODERATE REVISION TIER
                      </Badge>
                    )}
                    {currentStudent.overallStats.priority === 'LOW' && (
                      <Badge className="bg-emerald-600 text-white gap-1.5 px-3 py-1 font-bold text-xs shadow-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" /> PROFICIENT MASTERY TIER
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Clean Diagnostic Scope Card (Replaced sensitive marks/mistake counts) */}
                <div className="bg-muted/40 border border-border/80 rounded-xl p-4 md:max-w-xs w-full space-y-2">
                  <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> Assessment Scope
                  </p>
                  <p className="text-xs text-foreground font-medium">
                    Continuous Lab Diagnostic • Assignments 5 to 12
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Designed for concept revision, algorithm recall, and targeted practice before exams.
                  </p>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* GUIDED CHAPTER STUDY FLOW: STUDY POINTS FIRST, THEN QUESTIONS ON CLICK */}
            {/* ============================================================== */}

            {/* VIEW A: CHAPTER DRILL-DOWN QUESTIONS VIEW (When a chapter is selected) */}
            {selectedChapterNumber !== null ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedChapterNumber(null)}
                      className="gap-2 text-xs font-semibold"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Chapters & Study Points</span>
                    </Button>
                    <div className="h-5 w-px bg-border" />
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-foreground">
                        {CHAPTER_STUDY_GUIDE[selectedChapterNumber]?.chapterTitle || `Assignment ${selectedChapterNumber}`}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Reviewing chapter questions and concept recall notes.
                      </p>
                    </div>
                  </div>

                  <Badge variant="outline" className="font-mono text-xs">
                    Assignment #{selectedChapterNumber}
                  </Badge>
                </div>

                {/* Chapter Questions List */}
                {currentChapterQuestions.length === 0 ? (
                  <Card className="p-8 text-center bg-card">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                    <h3 className="text-base font-bold text-foreground">All Questions Mastered in this Chapter!</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                      You answered all questions correctly in this assignment. Click &quot;Back to Chapters&quot; to review other topics.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {currentChapterQuestions.map((q, idx) => (
                      <Card key={idx} className="border border-border/80 shadow-xs overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-3 border-b border-border/40">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                Q#{q.questionId}
                              </Badge>
                              <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
                                {q.topic}
                              </Badge>
                            </div>
                            <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                              <XCircle className="h-3.5 w-3.5" /> Incorrect Response
                            </span>
                          </div>
                          <CardTitle className="text-sm sm:text-base font-semibold leading-relaxed mt-2 text-foreground">
                            {q.questionText}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                          {/* Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelectedWrong = opt === q.selectedOption && opt !== q.correctAnswer;
                              const isCorrect = opt === q.correctAnswer;

                              let cardStyle = 'border-border bg-card text-muted-foreground';
                              let icon = null;

                              if (isSelectedWrong) {
                                cardStyle = 'border-red-500 bg-red-500/10 text-red-900 dark:text-red-200 font-semibold';
                                icon = <XCircle className="h-4 w-4 text-red-600 shrink-0" />;
                              } else if (isCorrect) {
                                cardStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-semibold';
                                icon = <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />;
                              }

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs transition-colors ${cardStyle}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-[11px] opacity-70">
                                      {String.fromCharCode(65 + optIdx)}.
                                    </span>
                                    <span>{opt}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {isSelectedWrong && (
                                      <Badge variant="destructive" className="text-[10px] py-0 px-1.5">
                                        Your Choice
                                      </Badge>
                                    )}
                                    {isCorrect && (
                                      <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-1.5">
                                        Correct
                                      </Badge>
                                    )}
                                    {icon}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Concept Recall Box */}
                          <div className="bg-muted/40 rounded-xl p-3.5 border border-border/80 space-y-2 text-xs">
                            <div className="flex items-start gap-2">
                              <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-primary">Core Principle to Remember: </span>
                                <span className="font-mono text-foreground leading-relaxed">{q.rule}</span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 pt-1 border-t border-border/40">
                              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-amber-600 dark:text-amber-400">Why this was missed: </span>
                                <span className="text-muted-foreground leading-relaxed">{q.pitfall}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1 border-t border-border/30 text-[10px] text-muted-foreground">
                              <Sparkles className="h-3 w-3 text-primary/70 shrink-0" />
                              <span>AI can make mistakes.</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* VIEW B: CHAPTERS & STUDY POINTS FIRST (No MCQs directly shown) */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Chapters & Key Concept Points to Learn First
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Study the key concept points and common traps first. Click on any chapter to inspect the specific questions you missed.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs self-start sm:self-auto font-mono">
                    Assignments 5 to 12
                  </Badge>
                </div>

                {/* Grid of Chapter Study Cards */}
                <div className="space-y-4">
                  {currentStudent.assignments.map(assign => {
                    const guide = CHAPTER_STUDY_GUIDE[assign.assignmentNumber];
                    const isHigh = assign.priority === 'HIGH';
                    const isMed = assign.priority === 'MEDIUM';
                    const isProf = assign.priority === 'LOW';

                    return (
                      <Card
                        key={assign.assignmentNumber}
                        className={`border transition-all hover:shadow-sm overflow-hidden ${
                          isHigh
                            ? 'border-red-300 dark:border-red-900 bg-red-500/5 dark:bg-red-950/10'
                            : isMed
                            ? 'border-amber-300 dark:border-amber-900 bg-amber-500/5 dark:bg-amber-950/10'
                            : 'border-emerald-300 dark:border-emerald-900 bg-emerald-500/5 dark:bg-emerald-950/10'
                        }`}
                      >
                        {/* Chapter Card Header */}
                        <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                  Assignment {assign.assignmentNumber}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-medium">
                                  {guide?.moduleName}
                                </span>
                              </div>
                              <CardTitle className="text-base sm:text-lg font-bold mt-1 text-foreground">
                                {guide?.chapterTitle || assign.title}
                              </CardTitle>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge
                                className={`text-xs font-bold ${
                                  isHigh
                                    ? 'bg-red-600 text-white'
                                    : isMed
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-emerald-600 text-white'
                                }`}
                              >
                                {isHigh ? 'CRITICAL PRIORITY' : isMed ? 'MODERATE PRIORITY' : 'PROFICIENT'}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>

                        {/* Chapter Study Points (Read First) */}
                        <CardContent className="pt-4 space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                              <Lightbulb className="h-3.5 w-3.5" /> Essential Points to Read & Learn First:
                            </h4>
                            <ul className="space-y-1.5 pl-1">
                              {guide?.keyPointsToLearnFirst.map((point, pIdx) => (
                                <li key={pIdx} className="text-xs text-foreground/90 leading-relaxed flex items-start gap-2">
                                  <span className="text-primary font-bold shrink-0 mt-0.5">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Common Exam Traps & Key Rule */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border/50 text-xs">
                            <div className="p-3 rounded-xl bg-background/80 border border-border space-y-1">
                              <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5" /> Common Pitfalls to Avoid
                              </p>
                              <ul className="space-y-1 pl-1">
                                {guide?.commonExamTraps.map((trap, tIdx) => (
                                  <li key={tIdx} className="text-muted-foreground text-[11px] leading-relaxed">
                                    - {trap}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-3 rounded-xl bg-background/80 border border-border space-y-1">
                              <p className="font-bold text-primary flex items-center gap-1.5">
                                <BookOpen className="h-3.5 w-3.5" /> Core Formula / Invariant to Recall
                              </p>
                              <p className="text-[11px] font-mono text-foreground leading-relaxed">
                                {guide?.keyFormulaOrRecurrence}
                              </p>
                            </div>
                          </div>

                          {/* Clickable Action to Reveal Specific Chapter Questions */}
                          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/50">
                            <span className="text-xs text-muted-foreground">
                              {assign.wrong > 0 ? (
                                <span className="text-amber-600 dark:text-amber-400 font-medium">
                                  Concept revision recommended for this chapter
                                </span>
                              ) : (
                                <span className="text-emerald-600 font-semibold">
                                  ✓ Concepts mastered in this chapter
                                </span>
                              )}
                            </span>

                            <Button
                              onClick={() => setSelectedChapterNumber(assign.assignmentNumber)}
                              size="sm"
                              className={`gap-1.5 text-xs font-bold ${
                                isHigh
                                  ? 'bg-red-600 hover:bg-red-700 text-white'
                                  : isMed
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              <FileQuestion className="h-4 w-4" />
                              <span>
                                {assign.wrong > 0
                                  ? `Open Chapter Questions & Concept Review`
                                  : `Review Chapter Questions`}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* AI Disclaimer Footer */}
      <footer className="mt-8 py-4 text-center text-xs text-muted-foreground print:hidden">
        <p className="flex items-center justify-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary/70 shrink-0" />
          <span>AI can make mistakes.</span>
        </p>
      </footer>
    </div>
  );
}
