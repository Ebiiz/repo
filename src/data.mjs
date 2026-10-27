export const titles = [
  {
    id: "iron-man",
    title: "Iron Man",
    type: "movie",
    releaseYear: 2008,
    releaseDate: "2008",
    genres: ["Action", "Science fiction"],
    franchiseId: "mcu",
    franchiseNames: ["Marvel Cinematic Universe"],
    storyPosition: 3,
    verification: "unverified",
    source: "Illustrative demo record",
    externalIds: { tmdb: null, imdb: null },
    availability: []
  },
  {
    id: "captain-america-first-avenger",
    title: "Captain America: The First Avenger",
    type: "movie",
    releaseYear: 2011,
    releaseDate: "2011",
    genres: ["Action", "Adventure"],
    franchiseId: "mcu",
    franchiseNames: ["Marvel Cinematic Universe"],
    storyPosition: 1,
    verification: "unverified",
    source: "Illustrative demo record",
    externalIds: { tmdb: null, imdb: null },
    availability: []
  },
  {
    id: "avengers",
    title: "The Avengers",
    type: "movie",
    releaseYear: 2012,
    releaseDate: "2012",
    genres: ["Action", "Adventure"],
    franchiseId: "mcu",
    franchiseNames: ["Marvel Cinematic Universe"],
    storyPosition: 4,
    verification: "unverified",
    source: "Illustrative demo record",
    externalIds: { tmdb: null, imdb: null },
    availability: []
  },
  {
    id: "guardians-of-the-galaxy",
    title: "Guardians of the Galaxy",
    type: "movie",
    releaseYear: 2014,
    releaseDate: "2014",
    genres: ["Action", "Science fiction"],
    franchiseId: "mcu",
    franchiseNames: ["Marvel Cinematic Universe"],
    storyPosition: 5,
    verification: "unverified",
    source: "Illustrative demo record",
    externalIds: { tmdb: null, imdb: null },
    availability: []
  },
  {
    id: "black-panther",
    title: "Black Panther",
    type: "movie",
    releaseYear: 2018,
    releaseDate: "2018",
    genres: ["Action", "Adventure"],
    franchiseId: "mcu",
    franchiseNames: ["Marvel Cinematic Universe"],
    storyPosition: 6,
    verification: "unverified",
    source: "Illustrative demo record",
    externalIds: { tmdb: null, imdb: null },
    availability: []
  },
  {
    id: "captain-marvel",
    title: "Captain Marvel",
    type: "movie",
    releaseYear: 2019,
    releaseDate: "2019",
    genres: ["Action", "Science fiction"],
    franchiseId: "mcu",
    franchiseNames: ["Marvel Cinematic Universe"],
    storyPosition: 2,
    verification: "unverified",
    source: "Illustrative demo record",
    externalIds: { tmdb: null, imdb: null },
    availability: []
  }
];

export const roadmaps = [{
  id: "mcu-sample",
  franchiseId: "mcu",
  title: "Marvel Cinematic Universe",
  entries: titles.filter((title) => title.franchiseId === "mcu").map((title) => ({
    titleId: title.id,
    releasePosition: title.releaseYear,
    storyPosition: title.storyPosition,
    explanation: null,
    spoilerWarning: false,
    canonStatus: "unverified",
    classification: "unverified",
    dependencies: []
  }))
}];
