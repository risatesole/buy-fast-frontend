export type HardCodedProductCategory = "Books" | "Notebooks" | "Pens" | "College";

export type Category = {
    id: number;
    name: string;
    description: string;
    create: Date;
    update: Date;
}