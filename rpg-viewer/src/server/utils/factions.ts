import type { z } from "zod"
import { FactionsFileSchema } from "../schemas"
import { getDataByType, findContentById } from "./contentUtils"

export const getFactionById = (id: string, campaignName = "shattered-spire") =>
	findContentById(id, "factions", campaignName, FactionsFileSchema, "factions")

export const getFactionData = (campaignName = "shattered-spire") => {
	return getDataByType("factions", FactionsFileSchema, campaignName)
}
