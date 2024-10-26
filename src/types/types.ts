// src/types.ts

export interface Player {
    id: string;
    rank: number;
    name: string;
    score: number;
    position: string;
    skills: {
        turns: number;
        catches: number;
        scores: number;
        defenses: number;
        totalthrows: number;
        goodthrows: number;
        teamWins: number;
    };
}
