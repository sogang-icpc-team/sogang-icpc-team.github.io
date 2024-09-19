import _2011 from "./2011";
import _2012 from "./2012";
import _2013 from "./2013";
import _2014 from "./2014";
import _2015 from "./2015";
import _2016 from "./2016";
import _2017 from "./2017";
import _2018 from "./2018";
import _2019 from "./2019";
import _2020 from "./2020";
import _2021 from "./2021";
import _2022 from "./2022";
import _2023 from "./2023";

type TSpcData = {
  year: number;
  edition: string;
  date: string;
  time: string;
  location: string;
  links: {
    scoreboards?: {
      Master: string;
      Champion: string;
    };
    problems: {
      workbookBOJ?: {
        Challenger: string;
        Champion: string;
      };
      BOJ?: string | null;
      PDF?: {
        Master: string;
        Champion: string;
      };
    };
    solutions?: {
      PDF: string;
    };
  };
  authors: string[];
  contests: {
    title: string;
    columns: string[];
    data: string[][];
    award: string[];
    links: string[][];
  }[];
};

export default [
  _2011,
  _2012,
  _2013,
  _2014,
  _2015,
  _2016,
  _2017,
  _2018,
  _2019,
  _2020,
  _2021,
  _2022,
  _2023,
] as TSpcData[];
