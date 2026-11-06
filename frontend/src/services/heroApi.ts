import { api } from "../lib/api";
import type { Hero, HeroResponse } from "../types/hero";

export async function getHero(): Promise<Hero> {
  const response = await api.get<HeroResponse>("/hero");

  return response.data.data;
}

export type UpdateHeroData = {
  title: string;
  subTitle: string;
  image?: File;
};

export async function updateHero(data: UpdateHeroData) {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("subTitle", data.subTitle);

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.put("/hero/update", formData);

  return response.data;
}
