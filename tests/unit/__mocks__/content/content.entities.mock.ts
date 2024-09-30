import type { CreateContentDto } from "@src/modules/content/dto/create-content.dto";
import type { ContentEntity } from "@src/modules/content/entities/content.entity";

export const createContentDtoMock: CreateContentDto = {
  "on-boarding": {
    "page-1": {
      "paragraphe-1":
        "Chez Daveo et Magellan Partners, chaque jour est une opportunité de grandir, de partager et de contribuer à des projets innovants pour façonner le futur de la tech ensemble.",
      "paragraphe-2":
        "Nous sommes impatients de te voir apporter ta touche unique à nos initiatives et de célébrer ensemble chaque réussite.",
    },
  },
};

export const contentEntityMock: ContentEntity = {
  id: "789QSD123",
  data: {
    "on-boarding": {
      "page-1": {
        "paragraphe-1":
          "Chez Daveo et Magellan Partners, chaque jour est une opportunité de grandir, de partager et de contribuer à des projets innovants pour façonner le futur de la tech ensemble.",
        "paragraphe-2":
          "Nous sommes impatients de te voir apporter ta touche unique à nos initiatives et de célébrer ensemble chaque réussite.",
      },
    },
  },
};