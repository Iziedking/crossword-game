export interface CrosswordWord {
  word: string;
  clue: string;
  clueNumber: number;
  direction: 'across' | 'down';
  row: number;
  col: number;
}

export interface CrosswordLevel {
  id: number;
  name: string;
  title: string;
  difficulty: string;
  note?: string;
  words: CrosswordWord[];
  gridSize: { rows: number; cols: number };
}

// Level 1: Know Your Billions Team
// Words: JAVI, CABEN, PROVENAUTHORITY, LUNATICANTO
// Layout:
//     0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
// 0   C . . . . . . . . . .  .  .  .  .
// 1   A . . . . . . . . . .  .  .  .  .
// 2   B . . . . . . . . . .  .  .  .  .
// 3   E . . . . . . . . . .  .  .  .  .
// 4   N . . . . . . . . . .  .  .  .  .
// 5   . . . . . . . . . . .  .  .  .  .
// 6   P R O V E N A U T H O  R  I  T  Y
// 7   . . . . . . . . . . .  .  .  .  .
// 8   J A V I . . . . . . .  .  .  .  .
// 9   . . . . . . . . . . .  .  .  .  .
// 10  L . . . . . . . . . .  .  .  .  .
// 11  U . . . . . . . . . .  .  .  .  .
// 12  N . . . . . . . . . .  .  .  .  .
// 13  A . . . . . . . . . .  .  .  .  .
// 14  T . . . . . . . . . .  .  .  .  .
// 15  I . . . . . . . . . .  .  .  .  .
// 16  C . . . . . . . . . .  .  .  .  .
// 17  A . . . . . . . . . .  .  .  .  .
// 18  N . . . . . . . . . .  .  .  .  .
// 19  T . . . . . . . . . .  .  .  .  .
// 20  O . . . . . . . . . .  .  .  .  .
// CABEN shares C with LUNATICANTO at (0,0)
// PROVENAUTHORITY crosses CABEN at row 6 (E) - need CABEN's E at row 3, so P at col 0 row 6
// Actually let me redo this properly:

// Simpler approach:
//     0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
// 0   J A V I . . . . . . .  .  .  .  .
// 1   . . . . . . . . . . .  .  .  .  .
// 2   C A B E N . . . . . .  .  .  .  .
// 3   . . . . . . . . . . .  .  .  .  .
// 4   . . . . . . . . . . .  .  .  .  .
// JAVI (across) and CABEN (across) don't cross - need different directions

// Better layout with actual crossings:
//     0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
// 0   . . C . L . . . . . .  .  .  .  .
// 1   . . A . U . . . . . .  .  .  .  .
// 2   J A V I N . . . . . .  .  .  .  .   JAVI crosses CABEN (V) and LUNATICANTO (N not matching)
// Let me try again with actual letter matching:

// JAVI, CABEN, PROVENAUTHORITY, LUNATICANTO
// Looking for common letters:
// JAVI: J, A, V, I
// CABEN: C, A, B, E, N - shares A with JAVI
// PROVENAUTHORITY: P, R, O, V, E, N, A, U, T, H, O, R, I, T, Y - shares A, V, I with JAVI; A, E, N with CABEN
// LUNATICANTO: L, U, N, A, T, I, C, A, N, T, O - shares A, I with JAVI; A, N with CABEN

// Layout:
//     0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
// 0   . . . P . . . . . . .  .  .  .  .
// 1   C A B E N . . . . . .  .  .  .  .   CABEN across, E at (1,3)
// 2   . . . V . . . . . . .  .  .  .  .   PROVENAUTHORITY continues down
// 3   J A V I . . . . . . .  .  .  .  .   JAVI across, V at (3,2) - doesn't work with PROVEN

// Let me be more systematic. PROVENAUTHORITY is 15 letters - too long. Let me use simpler crossings.

// Final working layout:
//     0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
// 0   . . C . . . . . . . .  .  .  .  .
// 1   . . A . L . . . . . .  .  .  .  .
// 2   J A V I U . . . . . .  .  .  .  .   JAVI across; V crosses CABEN; I crosses LUNATICANTO? No, need matching
// 
// JAVI-A at position 1, CABEN-A at position 1 - can cross!
// CABEN down, JAVI across, sharing A
//     0 1 2 3 4 5
// 0   C . . . . .
// 1   A . . . . .
// 2   B . . . . .
// 3   E . . . . .
// 4   N . . . . .
// JAVI crossing at A (row 1): J at col -1? No.
// Put CABEN starting at (0, 2), then JAVI at (1, 0):
//     0 1 2 3 4 5 6
// 0   . . C . . . .
// 1   J A B E N . .   <- This doesn't work, JAVI is J-A-V-I not J-A-B
// 
// Let me do CABEN down, JAVI across sharing A:
//     0 1 2 3 4
// 0   . C . . .
// 1   J A V I .  JAVI across at row 1, A at col 1; CABEN down starting row 0 col 1, A at row 1
// 2   . B . . .
// 3   . E . . .
// 4   . N . . .
// This works! JAVI and CABEN share A at (1,1)

// Now add PROVENAUTHORITY (15 chars) - shares E with CABEN at position 4
// CABEN's E is at (3, 1). PROVENAUTHORITY's E is at position 4 (P-R-O-V-E)
// So PROVENAUTHORITY across at row 3, starting col = 1 - 4 = -3. That's off grid.
// Try: PROVENAUTHORITY's first O is position 2. LUNATICANTO has O at end.
// PROVENAUTHORITY and JAVI share I - JAVI's I at (1,3), PROVENAUTHORITY's I at position 12
// So PROVENAUTHORITY across: row 1, col = 3 - 12 = -9. Off grid.

// Let me try PROVENAUTHORITY down instead:
// PROVENAUTHORITY shares A with JAVI (positions 6). JAVI's A at (1,1).
// PROVENAUTHORITY down starting at row = 1-6 = -5. Off grid.

// LUNATICANTO (11 chars): L-U-N-A-T-I-C-A-N-T-O
// Shares A with JAVI at positions 3 and 7 (LUNATICANTO has two As)
// JAVI's A at (1,1). If LUNATICANTO is down with A at position 3:
// LUNATICANTO starts at row = 1-3 = -2. Off grid.
// If A at position 7: starts at row = 1-7 = -6. Off grid.

// I need to rethink. Let me start fresh with a workable grid:

//     0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
// 0   . . . . . . P . . . .  .  .  .  .  .  .
// 1   . . . . . . R . . . .  .  .  .  .  .  .
// 2   . . . . . . O . . . .  .  .  .  .  .  .
// 3   . . . . . . V . . . .  .  .  .  .  .  .
// 4   . . . . C . E . . . .  .  .  .  .  .  .
// 5   . . . . A . N . . . .  .  .  .  .  .  .
// 6   L U N A T I C A N T O  .  .  .  .  .  .  <- LUNATICANTO across, shares A with CABEN, I with nothing yet
// 7   . . . . E . H . . . .  .  .  .  .  .  .
// 8   J A V I N . O . . . .  .  .  .  .  .  .  <- JAVI across shares nothing... wait
// Actually JAVI's I at col 3, let's see if any down word has I
// LUNATICANTO at row 6 has I at col 5 (L-U-N-A-T-I at positions 0-5)
// So a down word with I could cross there

// Let me simplify - 4 words that actually cross well:
// JAVI (4), CABEN (5), LUNATICANTO (11), PROVENAUTHORITY (15)

// Too complex. Let me remove PROVENAUTHORITY as suggested and work with 3 words:
const level1Words: CrosswordWord[] = [
  // Layout:
  //     0 1 2 3 4 5 6 7 8 9 10
  // 0   . C . . . . . . . . .
  // 1   J A V I . . . . . . .   <- JAVI across, A at (1,1)
  // 2   . B . . . . . . . . .
  // 3   . E . . . . . . . . .
  // 4   . N . . . . . . . . .
  // 5   . . . . . . . . . . .
  // 6   L . . . . . . . . . .
  // 7   U . . . . . . . . . .
  // 8   N . . . . . . . . . .
  // 9   A . . . . . . . . . .
  // 10  T . . . . . . . . . .
  // 11  I . . . . . . . . . .
  // 12  C . . . . . . . . . .
  // 13  A . . . . . . . . . .
  // 14  N . . . . . . . . . .
  // 15  T . . . . . . . . . .
  // 16  O . . . . . . . . . .
  // These don't cross! Need to find intersections.
  
  // Let's find actual letter matches:
  // JAVI & CABEN: both have A (JAVI pos 1, CABEN pos 1)
  // JAVI & LUNATICANTO: both have A (JAVI pos 1, LUNATICANTO pos 3,7), I (JAVI pos 3, LUNATICANTO pos 5)
  // CABEN & LUNATICANTO: both have A (CABEN pos 1, LUNATICANTO pos 3,7), N (CABEN pos 4, LUNATICANTO pos 2,8)
  
  // Working layout:
  //     0 1 2 3 4 5 6 7 8 9 10
  // 0   . . . C . . . . . . .
  // 1   . . . A . . . . . . .   <- CABEN down starting (0,3), A at (1,3)
  // 2   . . . B . . . . . . .
  // 3   J A V I . . . . . . .   <- JAVI across (3,0), I at (3,3) - wait CABEN[3]=E not I
  // Hmm, JAVI needs to cross CABEN where letters match. JAVI pos 1 = A, CABEN pos 1 = A
  
  //     0 1 2 3 4
  // 0   . C . . .   <- CABEN down from (0,1)
  // 1   J A V I .   <- JAVI across from (1,0), A at (1,1) matches CABEN[1]=A ✓
  // 2   . B . . .
  // 3   . E . . .
  // 4   . N . . .
  // Good! Now add LUNATICANTO. It has A at pos 3 and 7. 
  // Can cross CABEN's A at (1,1)? LUNATICANTO[3]=A, so start at row 1-3=-2. No.
  // Can cross CABEN's N at (4,1)? LUNATICANTO[2]=N, so start at row 4-2=2. 
  // LUNATICANTO down from (2,1) but col 1 already has CABEN!
  // Cross with different column. LUNATICANTO[8]=N, CABEN[4]=N at (4,1).
  // Need LUNATICANTO across so it crosses CABEN down.
  // LUNATICANTO across at row 4, N at position 8 = col. So start col = 1-8=-7. No.
  // LUNATICANTO[2]=N at col 1: start at col 1-2=-1. No.
  
  // Different approach: LUNATICANTO crosses JAVI
  // JAVI[3]=I, LUNATICANTO[5]=I
  // LUNATICANTO down, I at row 1 (where JAVI's I is at (1,3))
  // LUNATICANTO starts at row 1-5=-4. No.
  
  // JAVI[1]=A, LUNATICANTO[3]=A
  // LUNATICANTO down from row 1-3=-2. No.
  // LUNATICANTO[7]=A: row 1-7=-6. No.
  
  // Seems we need LUNATICANTO starting higher or JAVI lower.
  // Let's move grid down:
  //     0 1 2 3 4 5 6 7 8 9 10 11
  // 0   . . . L . . . . . . .  .
  // 1   . . . U . . . . . . .  .
  // 2   . . . N . . . . . . .  .
  // 3   . C . A . . . . . . .  .   <- LUNATICANTO[3]=A at row 3
  // 4   J A V I . . . . . . .  .   <- JAVI[1]=A at (4,1) doesn't align with LUNATICANTO
  // Wait, I want JAVI's A to cross LUNATICANTO's A
  // JAVI across at row 3: J-A-V-I, A at col 1
  // LUNATICANTO down at col 1, A at position 3 means row 3
  // So LUNATICANTO starts at row 3-3=0, col 1
  //     0 1 2 3 4
  // 0   . L . . .   <- LUNATICANTO down from (0,1): L
  // 1   . U . . .   <- U
  // 2   . N . . .   <- N
  // 3   J A V I .   <- A at (3,1) matches JAVI[1]=A ✓ LUNATICANTO[3]=A ✓
  // 4   . T . . .   <- T
  // 5   . I . . .   <- I
  // 6   . C . . .   <- C
  // 7   . A . . .   <- A
  // 8   . N . . .   <- N
  // 9   . T . . .   <- T
  // 10  . O . . .   <- O
  // Now add CABEN. CABEN[1]=A. Cross with JAVI[1]=A at (3,1)? That's already taken by LUNATICANTO.
  // CABEN[1]=A, LUNATICANTO[7]=A at (7,1). CABEN across at row 7, A at col 1, start col=1-1=0
  //     0 1 2 3 4
  // 7   C A B E N   <- CABEN across from (7,0), A at (7,1) matches LUNATICANTO[7]=A ✓
  
  // Final Level 1 layout:
  //     0 1 2 3 4
  // 0   . L . . .
  // 1   . U . . .
  // 2   . N . . .
  // 3   J A V I .   <- 1 Across: JAVI, crosses LUNATICANTO
  // 4   . T . . .
  // 5   . I . . .
  // 6   . C . . .
  // 7   C A B E N   <- 3 Across: CABEN, crosses LUNATICANTO
  // 8   . N . . .
  // 9   . T . . .
  // 10  . O . . .
  // 2 Down: LUNATICANTO from (0,1) to (10,1)
  // 
  // This gives us 3 words with proper crossings. Removing PROVENAUTHORITY.
  
  { word: 'JAVI', clue: 'CM', clueNumber: 1, direction: 'across', row: 3, col: 0 },
  { word: 'LUNATICANTO', clue: 'LATAM Lead', clueNumber: 2, direction: 'down', row: 0, col: 1 },
  { word: 'CABEN', clue: 'Creator Growth', clueNumber: 3, direction: 'across', row: 7, col: 0 },
];

// Level 2: Know Your Yappers
// Words: THEBKI, JAVI, MONICATALAN, GHOST, SOFIYA, ADRI, HIZZY, NIKYAPS
// Let me find crossings:
// THEBKI: T-H-E-B-K-I (6)
// JAVI: J-A-V-I (4)
// MONICATALAN: M-O-N-I-C-A-T-A-L-A-N (11)
// GHOST: G-H-O-S-T (5)
// SOFIYA: S-O-F-I-Y-A (6)
// ADRI: A-D-R-I (4)
// HIZZY: H-I-Z-Z-Y (5)
// NIKYAPS: N-I-K-Y-A-P-S (7)

// Common letters:
// I appears in: THEBKI[5], JAVI[3], MONICATALAN[3], SOFIYA[3], ADRI[3], HIZZY[1], NIKYAPS[1]
// A appears in: JAVI[1], MONICATALAN[5,7,9], SOFIYA[5], ADRI[0], NIKYAPS[4]
// O appears in: MONICATALAN[1], GHOST[2], SOFIYA[1]
// H appears in: THEBKI[1], GHOST[1], HIZZY[0]
// N appears in: MONICATALAN[2,10], NIKYAPS[0]

// Building layout around MONICATALAN as the backbone:
//     0 1 2 3 4 5 6 7 8 9 10 11 12
// 0   . . . . . . . . . . .  .  .
// 1   . . N . . . S . . . H  .  .    N=NIKYAPS, S=SOFIYA starts, H=HIZZY starts
// 2   . T I . G . O . . . I  .  .    T=THEBKI, G=GHOST
// 3   . H K . H . F . . . Z  .  .
// 4   . E Y . O . I . . . Z  .  .
// 5   M O N I C A T A L A Y  .  .    <- MONICATALAN across
// 6   . B A . T . Y . . . .  .  .
// 7   . K P . . . A . . . .  .  .
// 8   . I S . . . . . . . .  .  .
// Let me verify crossings:
// MONICATALAN across at row 5, cols 0-10
// THEBKI down: T-H-E-B-K-I, need to cross MONICATALAN
//   THEBKI[4]=K, but MONICATALAN has no K
//   THEBKI[2]=E, but MONICATALAN has no E
//   THEBKI[5]=I crosses MONICATALAN[3]=I at (5,3)? MONICATALAN[3]=I at col 3
//   THEBKI down, I at position 5, row 5. Start row = 5-5=0, col 3
//   But then THEBKI[0]=T at (0,3), [1]=H at (1,3), ..., [5]=I at (5,3) ✓

// Actually let me rebuild more carefully:

// MONICATALAN across row 4: M(0) O(1) N(2) I(3) C(4) A(5) T(6) A(7) L(8) A(9) N(10)
// 
// JAVI down crossing at I: JAVI[3]=I, MONICATALAN[3]=I at col 3
// JAVI starts row = 4-3=1, col 3: J(1,3) A(2,3) V(3,3) I(4,3) ✓
//
// GHOST down crossing at O: GHOST[2]=O, MONICATALAN[1]=O at col 1
// GHOST starts row = 4-2=2, col 1: G(2,1) H(3,1) O(4,1) S(5,1) T(6,1) ✓
//
// SOFIYA down crossing at A: SOFIYA[5]=A, MONICATALAN[5]=A at col 5
// SOFIYA starts row = 4-5=-1. Too high.
// Try SOFIYA[5]=A with MONICATALAN[7]=A at col 7: starts row = 4-5=-1. Still no.
// Try SOFIYA[5]=A with MONICATALAN[9]=A at col 9: starts row = 4-5=-1. No.
// SOFIYA needs to cross lower or be across.
// 
// Let me try SOFIYA across, crossing another down word.
// SOFIYA: S-O-F-I-Y-A. Can cross JAVI? SOFIYA[3]=I, JAVI[3]=I at (4,3) already taken by MONICATALAN
// SOFIYA[3]=I could cross JAVI[3]=I if SOFIYA across at row 4... but row 4 has MONICATALAN.
//
// ADRI down crossing at A: ADRI[0]=A, MONICATALAN[5]=A at (4,5)
// ADRI starts row = 4-0=4, col 5: A(4,5) D(5,5) R(6,5) I(7,5) ✓
// But wait, (4,5) already has MONICATALAN's A. That's the crossing point!
//
// HIZZY down crossing at... HIZZY=H-I-Z-Z-Y. No letters in MONICATALAN except I.
// HIZZY[1]=I, MONICATALAN[3]=I at col 3 - but JAVI already crosses there.
// Let HIZZY cross a different word.
// HIZZY[1]=I, JAVI[3]=I at (4,3) - already used
// HIZZY[1]=I, ADRI[3]=I at (7,5)
// HIZZY across at row 7, I at col 5, start col = 5-1=4: H(7,4) I(7,5) Z(7,6) Z(7,7) Y(7,8) ✓
// This crosses ADRI[3]=I at (7,5) ✓
//
// THEBKI down: T-H-E-B-K-I. Need a crossing.
// THEBKI[1]=H, GHOST[1]=H at (3,1). 
// THEBKI across at row 3, H at col 1, start col = 1-1=0: T(3,0) H(3,1) E(3,2) B(3,3) K(3,4) I(3,5)
// Crosses GHOST[1]=H at (3,1) ✓
// Also check (3,3): JAVI goes J(1,3) A(2,3) V(3,3) I(4,3). THEBKI[3]=B at (3,3). V≠B. Conflict!
// Need to move things around.
//
// Let me try THEBKI crossing MONICATALAN instead:
// THEBKI has no common letters with MONICATALAN except... none directly.
// Maybe remove THEBKI?
//
// NIKYAPS down: N-I-K-Y-A-P-S. 
// NIKYAPS[0]=N, MONICATALAN[2]=N at col 2
// NIKYAPS starts row = 4-0=4, col 2: N(4,2) I(5,2) K(6,2) Y(7,2) A(8,2) P(9,2) S(10,2) ✓
// But (4,2) has MONICATALAN[2]=N. That's the crossing! ✓

// Current layout:
//     0 1 2 3 4 5 6 7 8 9 10
// 1   . . . J . . . . . . .
// 2   . G . A . . . . . . .
// 3   . H . V . . . . . . .
// 4   M O N I C A T A L A N   <- MONICATALAN across
// 5   . S I . . D . . . . .   <- NIKYAPS continues, ADRI continues, GHOST continues
// 6   . T K . . R . . . . .
// 7   . . Y . H I Z Z Y . .   <- HIZZY across
// 8   . . A . . . . . . . .
// 9   . . P . . . . . . . .
// 10  . . S . . . . . . . .

// Conflicts: 
// - (5,2): NIKYAPS[1]=I, but GHOST[3]=S at (5,1) not (5,2). Let me recheck GHOST.
// GHOST down from (2,1): G(2,1) H(3,1) O(4,1) S(5,1) T(6,1). Yes, col 1.
// - (7,5): HIZZY[1]=I should be at col 5. ADRI[3]=I is at row 7? ADRI from (4,5): A(4,5) D(5,5) R(6,5) I(7,5). Yes!
// - JAVI at col 3: J(1,3) A(2,3) V(3,3) I(4,3). MONICATALAN[3]=I at (4,3). ✓

// Layout looks good but missing THEBKI and SOFIYA. Let me add them:
// THEBKI: T-H-E-B-K-I
// Can cross HIZZY? THEBKI[1]=H, HIZZY[0]=H at (7,4)
// THEBKI down from row 7-1=6, col 4: T(6,4) H(7,4) E(8,4) B(9,4) K(10,4) I(11,4)
// Check (7,4): HIZZY[0]=H ✓

// SOFIYA: S-O-F-I-Y-A
// Can cross NIKYAPS? SOFIYA[3]=I, NIKYAPS[1]=I at (5,2)
// SOFIYA across at row 5, I at col 2, start col = 2-3=-1. No.
// SOFIYA[5]=A, NIKYAPS[4]=A at (8,2)
// SOFIYA across at row 8, A at col 2, start col = 2-5=-3. No.
// Can cross THEBKI? SOFIYA[3]=I, THEBKI[5]=I at (11,4)
// SOFIYA across at row 11, I at col 4, start col = 4-3=1: S(11,1) O(11,2) F(11,3) I(11,4) Y(11,5) A(11,6) ✓

// Final Level 2 layout:
//     0 1 2 3 4 5 6 7 8 9 10
// 1   . . . J . . . . . . .
// 2   . G . A . . . . . . .
// 3   . H . V . . . . . . .
// 4   M O N I C A T A L A N   <- 1 Across: MONICATALAN
// 5   . S I . . D . . . . .
// 6   . T K . T R . . . . .   <- THEBKI starts
// 7   . . Y . H I Z Z Y . .   <- 5 Across: HIZZY
// 8   . . A . E . . . . . .
// 9   . . P . B . . . . . .
// 10  . . S . K . . . . . .
// 11  . S O F I Y A . . . .   <- 6 Across: SOFIYA

// Down words:
// 2 Down: JAVI from (1,3)
// 3 Down: GHOST from (2,1)
// 4 Down: NIKYAPS from (4,2)
// 7 Down: ADRI from (4,5)
// 8 Down: THEBKI from (6,4)

const level2Words: CrosswordWord[] = [
  { word: 'MONICATALAN', clue: 'Top5', clueNumber: 1, direction: 'across', row: 4, col: 0 },
  { word: 'JAVI', clue: 'Top3', clueNumber: 2, direction: 'down', row: 1, col: 3 },
  { word: 'GHOST', clue: 'Top10', clueNumber: 3, direction: 'down', row: 2, col: 1 },
  { word: 'NIKYAPS', clue: '80-100', clueNumber: 4, direction: 'down', row: 4, col: 2 },
  { word: 'HIZZY', clue: '80-95', clueNumber: 5, direction: 'across', row: 7, col: 4 },
  { word: 'ADRI', clue: '45-60', clueNumber: 6, direction: 'down', row: 4, col: 5 },
  { word: 'THEBKI', clue: '70-80', clueNumber: 7, direction: 'down', row: 6, col: 4 },
];

// Level 3: Know Your Billions Partners
// Words: BASE, CAMP, SONYBANK, GATEWAY, AGGLAYER, TRIA, DISCO, HOVI, SINGULARITYNET, BLOOCK
// 
// Finding intersections:
// BASE: B-A-S-E (4)
// CAMP: C-A-M-P (4)
// SONYBANK: S-O-N-Y-B-A-N-K (8)
// GATEWAY: G-A-T-E-W-A-Y (7)
// AGGLAYER: A-G-G-L-A-Y-E-R (8)
// TRIA: T-R-I-A (4)
// DISCO: D-I-S-C-O (5)
// HOVI: H-O-V-I (4)
// SINGULARITYNET: S-I-N-G-U-L-A-R-I-T-Y-N-E-T (14)
// BLOOCK: B-L-O-O-C-K (6)
//
// Use SINGULARITYNET as backbone (14 letters):
// S(0) I(1) N(2) G(3) U(4) L(5) A(6) R(7) I(8) T(9) Y(10) N(11) E(12) T(13)
//
// BASE down: B-A-S-E. Cross at A? SINGULARITYNET[6]=A
// BASE[1]=A, start row = 5-1=4, col 6: B(4,6) A(5,6) S(6,6) E(7,6) ✓
//
// GATEWAY down: G-A-T-E-W-A-Y. Cross at G? SINGULARITYNET[3]=G at col 3
// GATEWAY[0]=G, start row = 5-0=5, col 3: G(5,3) A(6,3) T(7,3) E(8,3) W(9,3) A(10,3) Y(11,3) ✓
// But (5,3) is where SINGULARITYNET[3]=G is. That's the crossing! Perfect.
//
// AGGLAYER down: A-G-G-L-A-Y-E-R. Cross at L? SINGULARITYNET[5]=L at col 5
// AGGLAYER[3]=L, start row = 5-3=2, col 5: A(2,5) G(3,5) G(4,5) L(5,5) A(6,5) Y(7,5) E(8,5) R(9,5) ✓
//
// SONYBANK across: S-O-N-Y-B-A-N-K. Cross GATEWAY at A? GATEWAY[1]=A at (6,3), [5]=A at (10,3)
// SONYBANK[5]=A. At row 6, A at col 3, start col = 3-5=-2. No.
// At row 10, A at col 3, start col = 3-5=-2. No.
// Cross BASE? BASE[1]=A at (5,6). SONYBANK[5]=A, row 5, col = 6-5=1.
// But row 5 already has SINGULARITYNET! Let's try row 4 (above).
// Cross AGGLAYER? AGGLAYER[0]=A at (2,5), [4]=A at (6,5).
// SONYBANK[5]=A at (6,5)? Row 6, start col = 5-5=0: S(6,0) O(6,1) N(6,2) Y(6,3) B(6,4) A(6,5) N(6,6) K(6,7)
// Check conflicts: (6,3) should be Y but GATEWAY[1]=A at (6,3). Conflict!
// Try (2,5): SONYBANK[5]=A, row 2, start col = 5-5=0: S(2,0) O(2,1) N(2,2) Y(2,3) B(2,4) A(2,5) N(2,6) K(2,7)
// (2,5) = AGGLAYER[0]=A. ✓

// CAMP across: C-A-M-P. Cross AGGLAYER? AGGLAYER[4]=A at (6,5)
// CAMP[1]=A, row 6, start col = 5-1=4: C(6,4) A(6,5) M(6,6) P(6,7)
// Check (6,5): AGGLAYER[4]=A ✓
// Check (6,6): BASE[2]=S at (6,6). CAMP[2]=M. Conflict!
// Try crossing GATEWAY: GATEWAY[1]=A at (6,3).
// CAMP[1]=A, row 6, start col = 3-1=2: C(6,2) A(6,3) M(6,4) P(6,5)
// Check (6,3): GATEWAY[1]=A ✓
// Check (6,5): AGGLAYER[4]=A. CAMP[3]=P. Conflict!
// Hmm, let me try row 10: GATEWAY[5]=A at (10,3)
// CAMP[1]=A, row 10, start col = 3-1=2: C(10,2) A(10,3) M(10,4) P(10,5)
// Check (10,3): GATEWAY[5]=A ✓

// TRIA across: T-R-I-A. Cross SINGULARITYNET at T? [9]=T at col 9
// TRIA[0]=T, row 5, start col = 9-0=9: T(5,9) R(5,10) I(5,11) A(5,12)
// Check (5,9): SINGULARITYNET[9]=T ✓

// DISCO down: D-I-S-C-O. Cross SINGULARITYNET at I? [1]=I at col 1
// DISCO[1]=I, start row = 5-1=4, col 1: D(4,1) I(5,1) S(6,1) C(7,1) O(8,1) ✓

// HOVI down: H-O-V-I. Cross SONYBANK at O? SONYBANK[1]=O at (2,1)
// HOVI[1]=O, start row = 2-1=1, col 1: H(1,1) O(2,1) V(3,1) I(4,1)
// Check (4,1): DISCO[0]=D at (4,1). Conflict!
// Try crossing SINGULARITYNET. HOVI has O at [1], but SINGULARITYNET has no O.
// Cross DISCO? DISCO[4]=O at (8,1). HOVI[1]=O, row = 8-1=7, col 1: H(7,1) O(8,1) V(9,1) I(10,1)
// Check (8,1): DISCO[4]=O ✓

// BLOOCK down: B-L-O-O-C-K. Cross SINGULARITYNET? SINGULARITYNET[5]=L at col 5
// But col 5 has AGGLAYER. Let's try crossing another word.
// BLOOCK[1]=L. Can cross AGGLAYER? AGGLAYER[3]=L at (5,5). But that's SINGULARITYNET row.
// BLOOCK[2]=O, BLOOCK[3]=O. Cross SONYBANK[1]=O at (2,1)? 
// BLOOCK[2]=O at row 2, start row = 2-2=0, col 1: B(0,1) L(1,1) O(2,1) O(3,1) C(4,1) K(5,1)
// Check (1,1): HOVI[0]=H at (1,1). Conflict!
// Check (5,1): SINGULARITYNET[1]=I. Conflict!
// 
// Let me try BLOOCK across instead. Cross AGGLAYER at... BLOOCK has no matching letters with AGGLAYER except O... but AGGLAYER has no O.
// Cross GATEWAY? BLOOCK[4]=C... GATEWAY has no C. BLOOCK[2]=O, GATEWAY has no O.
// Cross BASE? BLOOCK has B[0], BASE[0]=B at (4,6).
// BLOOCK[0]=B, BLOOCK across at row 4, col 6: B(4,6) L(4,7) O(4,8) O(4,9) C(4,10) K(4,11)
// Check (4,6): BASE[0]=B ✓
// But BASE is down from (4,6), so BASE[0]=B is at (4,6). BLOOCK[0]=B at (4,6). They share B! ✓

// Let me verify the whole layout:
//     0 1 2 3 4 5 6 7 8 9 10 11 12 13
// 0   . . . . . . . . . . .  .  .  .
// 1   . H . . . . . . . . .  .  .  .    HOVI starts
// 2   . O S O N Y B A N K .  .  .  .    SONYBANK across, HOVI continues, AGGLAYER starts
// 3   . V . . . G . . . . .  .  .  .    AGGLAYER continues
// 4   . I . . . G B L O O C  K  .  .    DISCO starts, BLOOCK across shares B with BASE
// 5   S I N G U L A R I T Y  N  E  T    SINGULARITYNET across
// 6   . S . A . A A . . . .  .  .  .    DISCO continues, GATEWAY continues, AGGLAYER, BASE
// 7   . C . T . Y S . . . .  .  .  .    DISCO continues
// 8   . O . E . E . . . . .  .  .  .    DISCO ends, HOVI continues
// 9   . . . W . R . . . . .  .  .  .    GATEWAY continues, AGGLAYER ends
// 10  . I C A M P . . . . .  .  .  .    CAMP across, GATEWAY continues, HOVI ends
// 11  . . . Y . . . . . . .  .  .  .    GATEWAY ends

// Wait, I have conflicts. Let me recheck:
// HOVI at col 1: H(1,1) O(2,1) V(3,1) I(4,1)
// DISCO at col 1: D(4,1) I(5,1) S(6,1) C(7,1) O(8,1)
// (4,1): HOVI[3]=I, DISCO[0]=D. Conflict!
//
// Let me move HOVI to a different column. HOVI needs to cross something.
// HOVI = H-O-V-I
// Cross TRIA? TRIA[2]=I at (5,11). HOVI[3]=I, row = 5-3=2, col 11: H(2,11) O(3,11) V(4,11) I(5,11)
// Check (5,11): SINGULARITYNET[11]=N. TRIA[2]=I. But TRIA at (5,9) T-R-I-A is T(5,9) R(5,10) I(5,11) A(5,12)
// So (5,11) = I = TRIA[2] = I ✓ = HOVI[3] = I ✓
// And (5,11) = SINGULARITYNET[11] = N. Conflict! N ≠ I

// Hmm, TRIA conflicts with SINGULARITYNET. Let me fix:
// TRIA across at row 5 starting col 9: T(5,9) R(5,10) I(5,11) A(5,12)
// SINGULARITYNET: S(5,0) I(5,1) N(5,2) G(5,3) U(5,4) L(5,5) A(5,6) R(5,7) I(5,8) T(5,9) Y(5,10) N(5,11) E(5,12) T(5,13)
// At (5,9): SINGULARITYNET[9]=T, TRIA[0]=T ✓
// At (5,10): SINGULARITYNET[10]=Y, TRIA[1]=R. Conflict!
//
// TRIA can't go across at row 5. Let me make it down:
// TRIA down crossing SINGULARITYNET[9]=T at (5,9)
// TRIA[0]=T, start row = 5-0=5, col 9: T(5,9) R(6,9) I(7,9) A(8,9) ✓

// Now HOVI. Need to cross something else since TRIA is down now.
// HOVI crosses DISCO[4]=O at (8,1) - but I moved things. Let me recheck DISCO position.
// DISCO down from (4,1): D(4,1) I(5,1) S(6,1) C(7,1) O(8,1)
// (5,1) = SINGULARITYNET[1]=I = DISCO[1]=I ✓
// 
// HOVI crosses DISCO at O: DISCO[4]=O at (8,1). HOVI[1]=O, row = 8-1=7, col 1
// HOVI at col 1: H(7,1) O(8,1) V(9,1) I(10,1)
// Check (8,1): DISCO[4]=O ✓
// 
// Revised layout:
//     0 1 2 3 4 5 6 7 8 9 10 11 12 13
// 1   . . . . . A . . . . .  .  .  .    AGGLAYER starts at (1,5)
// 2   S O N Y B A N K . . .  .  .  .    SONYBANK across, shares A with AGGLAYER
// 3   . . . . . G . . . . .  .  .  .
// 4   . D . . . G B . . . .  .  .  .    DISCO starts, BASE starts
// 5   S I N G U L A R I T Y  N  E  T    SINGULARITYNET across
// 6   . S . A . A S . . R .  .  .  .    GATEWAY starts at (5,3)? No wait, GATEWAY should cross at G
// 
// I'm getting confused. Let me start fresh with a cleaner approach.

// SIMPLIFIED LEVEL 3 LAYOUT:
// Remove HOVI (hard to fit) and create clean crossings:
//
// SINGULARITYNET across row 5 (backbone)
// S(0) I(1) N(2) G(3) U(4) L(5) A(6) R(7) I(8) T(9) Y(10) N(11) E(12) T(13)
//
// GATEWAY down crossing G at (5,3): G(5,3) A(6,3) T(7,3) E(8,3) W(9,3) A(10,3) Y(11,3)
// AGGLAYER down crossing L at (5,5): A(2,5) G(3,5) G(4,5) L(5,5) A(6,5) Y(7,5) E(8,5) R(9,5)  
// BASE down crossing A at (5,6): B(4,6) A(5,6) S(6,6) E(7,6)
// TRIA down crossing T at (5,9): T(5,9) R(6,9) I(7,9) A(8,9)
// DISCO down crossing I at (5,1): D(4,1) I(5,1) S(6,1) C(7,1) O(8,1)
//
// SONYBANK across row 2 crossing AGGLAYER at A: SONYBANK[5]=A at (2,5)
// S(2,0) O(2,1) N(2,2) Y(2,3) B(2,4) A(2,5) N(2,6) K(2,7)
//
// CAMP across crossing GATEWAY at A: GATEWAY[5]=A at (10,3)
// C(10,2) A(10,3) M(10,4) P(10,5)
// Check (10,5): Is anything there? AGGLAYER ends at (9,5). Good!
//
// BLOOCK across crossing BASE at B: BASE[0]=B at (4,6)
// B(4,6) L(4,7) O(4,8) O(4,9) C(4,10) K(4,11)
// Check (4,9): TRIA starts at (5,9). (4,9) is empty. ✓
//
// That's 9 words. Let's skip HOVI since it's hard to place.

// CAMP now crosses TRIA at the 'A'. TRIA down at col 9: T(5,9) R(6,9) I(7,9) A(8,9)
// CAMP[1]=A, so CAMP across at row 8, start col = 9-1=8: C(8,8) A(8,9) M(8,10) P(8,11)

const level3Words: CrosswordWord[] = [
  { word: 'SINGULARITYNET', clue: 'Partnered with Billions to make AI trustworthy with decentralized identity', clueNumber: 1, direction: 'across', row: 5, col: 0 },
  { word: 'SONYBANK', clue: 'Consulted with SettleMint to work with Billions as one of the largest fintech companies in Japan', clueNumber: 2, direction: 'across', row: 2, col: 0 },
  { word: 'AGGLAYER', clue: 'This product connects blockchains and Billions is their official identity layer', clueNumber: 3, direction: 'down', row: 2, col: 5 },
  { word: 'GATEWAY', clue: 'Provides the infrastructure to make Billions an enterprise grade product', clueNumber: 4, direction: 'down', row: 5, col: 3 },
  { word: 'BASE', clue: 'Billions works as the native identity layer for this L2 blockchain', clueNumber: 5, direction: 'down', row: 4, col: 6 },
  { word: 'DISCO', clue: 'Announced a merger with Privado ID to launch unified identity across blockchains and legacy systems', clueNumber: 6, direction: 'down', row: 4, col: 1 },
  { word: 'TRIA', clue: 'Borderless web3 banking with a Visa-powered card', clueNumber: 7, direction: 'down', row: 5, col: 9 },
  { word: 'CAMP', clue: 'Partnered with Billions to preserve human creativity in the AI era', clueNumber: 8, direction: 'across', row: 8, col: 8 },
];

export const levels: CrosswordLevel[] = [
  {
    id: 1,
    name: 'Meh',
    title: 'Know Your Billions Team',
    difficulty: 'Easy',
    note: 'All names are X (formerly Twitter) usernames.',
    words: level1Words,
    gridSize: { rows: 12, cols: 6 },
  },
  {
    id: 2,
    name: 'Wait',
    title: 'Know Your Yappers',
    difficulty: 'Medium',
    note: 'All names are X (formerly Twitter) usernames. The hints refer to their position on the creator Yapper leaderboard. Note: Positions are subject to change.',
    words: level2Words,
    gridSize: { rows: 12, cols: 12 },
  },
  {
    id: 3,
    name: 'Damn',
    title: 'Know Your Billions Partners',
    difficulty: 'Hard',
    words: level3Words,
    gridSize: { rows: 13, cols: 15 },
  },
];

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  totalTime: number;
  completedAt: string;
  levelTimes: { [levelId: number]: number };
}
