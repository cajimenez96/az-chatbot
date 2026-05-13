import { IsString, IsOptional, IsEnum } from "class-validator";
import type { LeadInterest } from "@az-chatbot/types";

export class CreateLeadDto {
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum([
    "autos-nuevos",
    "autos-usados",
    "financiacion",
    "servicios",
    "contacto",
    "otro",
  ])
  interest?: LeadInterest;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  vehicle?: string;

  @IsOptional()
  @IsString()
  budget?: string;
}
