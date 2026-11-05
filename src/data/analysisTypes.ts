/**
 * Auto-generated analysis types for IT 580 assessment portal.
 */

export interface WrongQuestionDetail {
  questionId: number;
  assignmentNumber: number;
  assignmentTitle: string;
  topic: string;
  questionText: string;
  options: string[];
  selectedOption: string;
  correctAnswer: string;
  rule: string;
  pitfall: string;
  tip: string;
}

export interface StudentAssignmentPerformance {
  assignmentNumber: number;
  title: string;
  attempted: number;
  correct: number;
  wrong: number;
  accuracy: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNATTENDED';
  priorityScore: number;
  recommendation: string;
  wrongQuestions: WrongQuestionDetail[];
}

export interface StudentTopicPerformance {
  topic: string;
  assignmentNumber: number;
  category: string;
  attempted: number;
  correct: number;
  wrong: number;
  accuracy: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  rule: string;
  pitfall: string;
  tip: string;
}

export interface RevisionStep {
  step: number;
  assignmentNumber: number;
  assignmentTitle: string;
  topic: string;
  mistakes: number;
  accuracy: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  rule: string;
  pitfall: string;
  tip: string;
}

export interface StudentAnalysisRecord {
  studentId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  course: string;
  group: string;
  contact: string;
  cleanContact: string;
  totalLabMarks: string;
  overallStats: {
    totalAttempted: number;
    totalCorrect: number;
    totalWrong: number;
    accuracy: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNATTENDED';
    priorityLabel: string;
  };
  assignments: StudentAssignmentPerformance[];
  assignmentsByPriority: number[];
  topics: StudentTopicPerformance[];
  topWeaknesses: string[];
  masteredTopics: string[];
  wrongQuestions: WrongQuestionDetail[];
  revisionPlan: RevisionStep[];
}

export interface ClassAssignmentStat {
  assignmentNumber: number;
  title: string;
  attempted: number;
  correct: number;
  wrong: number;
  accuracy: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ClassTopicStat {
  topic: string;
  assignmentNumber: number;
  assignmentTitle: string;
  attempted: number;
  correct: number;
  wrong: number;
  accuracy: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface HardestQuestionStat {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  assignmentNumber: number;
  assignmentTitle: string;
  topic: string;
  attempted: number;
  wrong: number;
  errorRate: number;
}

export interface AnalysisDataset {
  metadata: {
    institution: string;
    subject: string;
    title: string;
    assignments: number[];
    totalStudents: number;
    totalResponses: number;
    totalQuestionsInBank: number;
  };
  classOverview: {
    totalAttempted: number;
    totalCorrect: number;
    totalWrong: number;
    overallAccuracy: number;
    assignments: ClassAssignmentStat[];
    topicBreakdown: ClassTopicStat[];
    hardestQuestions: HardestQuestionStat[];
  };
  students: StudentAnalysisRecord[];
}
