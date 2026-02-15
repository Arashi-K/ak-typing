import { BuildData } from "@/resources/build_data";

export const WordManager = {
  sampleWord(): string {
    return arrayRandomFetch(BuildData.words);
  },
  sampleWords(size: number): string[] {
    return [...Array(size)].map(() => this.sampleWord());
  },
};
