import { ApiProperty } from "@nestjs/swagger";
import { PracticeVideo } from "@modules/practice/entities/practice-video.entity";
import { PracticeFeedback } from "@modules/practice/entities/practice-feedback.entity";

export class Practice {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public summary: string;

  @ApiProperty({ type: [String] })
  public tags: string[];

  @ApiProperty()
  public description: string;

  @ApiProperty({ type: [String] })
  public jobs: string[];

  @ApiProperty({ type: [PracticeVideo] })
  public videos: PracticeVideo[];
  
  @ApiProperty({ type: PracticeFeedback })
  public feedback: PracticeFeedback;
}