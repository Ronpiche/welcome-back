import type { CreateAgencyDto } from "@src/modules/agencies/dto/create-agency.dto";
import type { OutputAgencyDto } from "@src/modules/agencies/dto/output-agency.dto";
import type { Agency } from "@src/modules/agencies/entities/agency.entity";

export const createAgencyMock: CreateAgencyDto = {
  name: "Paris",
  coordinates: [2.34, 48.88],
  address: "1 rue du test",
  creationYear: 2008,
  services: ["kitchen"],
  customers: ["TotalEnergies", "TF1", "Cegedim Santé", "Société Générale", "LVMH", "Servier"],
  goodPlaces: ["Poni", "Chez Agnès", "Café Lorette", "Brittany Hôtel & Bar", "Bleu Bao"],
};

export const agencyMock: Agency = {
  _id: "test",
  name: "Paris",
  coordinates: [2.34, 48.88],
  address: "1 rue du test",
  creationYear: 2008,
  services: ["kitchen"],
  customers: ["TotalEnergies", "TF1", "Cegedim Santé", "Société Générale", "LVMH", "Servier"],
  goodPlaces: ["Poni", "Chez Agnès", "Café Lorette", "Brittany Hôtel & Bar", "Bleu Bao"],
};

export const outputAgencyMock: OutputAgencyDto = {
  _id: "test",
  name: "Paris",
  coordinates: [2.34, 48.88],
  address: "1 rue du test",
  creationYear: 2008,
  services: ["kitchen"],
  customers: ["TotalEnergies", "TF1", "Cegedim Santé", "Société Générale", "LVMH", "Servier"],
  goodPlaces: ["Poni", "Chez Agnès", "Café Lorette", "Brittany Hôtel & Bar", "Bleu Bao"],
};