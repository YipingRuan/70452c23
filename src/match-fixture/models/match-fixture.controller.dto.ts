import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, Min, Max } from "class-validator";

export class ListDailyMatchesQueryDto {
    @ApiProperty({ description: 'As "YYYY-MM-DD"' })
    @IsDateString()
    date: string;

    @IsNumber()
    @Min(-15)
    @Max(15)
    timezoneOffset: number;
}

export class ListDailyMatchesResponseDto {
    date: string
    timezoneOffset: number
    localDay: string[]
    matches: MatchDto[]
}

export class ListMonthlyMatchMaskQueryDto {
    @IsNumber()
    @Min(2000)
    @Max(2030)
    year: number;

    @IsNumber()
    @Min(1)
    @Max(12)
    month: number;
}

export class MatchDto {
    id: Number
    time: Number
    tournamentId: Number
    homeTeamId: Number
    awayTeamId: Number
    score: string
    isEnded: boolean
    isLive: boolean
}