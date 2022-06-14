let arr_EN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const ContainerContentTop = styled("div")<{ bg: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ bg }) => bg};
  align-items: center;
  justify-content: center;
`;
export const ContentRes = styled("div")`
  display: flex;
  border-bottom: solid 1px #4e4e4e;
  justify-content: center;
  width: 1300px;
  @media (max-width: 1300px) {
    width: 100%;
  }
  @media (max-width: 990px) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
export const Btn = styled(Button)`
  background: #f5af27;
  color: #000;
  width: 175px;
  border-radius: 0;
  &:hover {
    background: #fff;
    color: #000;
  }
  @media (max-width: 990px) {
    height: 60px;
  }
`;
export const CustomUl = styled("ul")`
  display: flex;
  padding: 0;
  margin: 50px 0;
  justify-content: center;
  flex-wrap: wrap;
  @media (max-width: 375px) {
    width: 95%;
  }
`;
const CustomLi = styled("li")<{ active?: boolean }>`
  list-style-type: none;
  width: 30px;
  height: 30px;
  border: ${({ active }) => (active ? "1px solid #fff" : "none")};
  box-sizing: border-box;
  font-size: 0.8em;
  a {
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-weight: 600;
    width: 100%;
    color: ${({ active }) => (active ? "#fff" : "#f5af27")};
  }
  :hover {
    border: 1px solid #fff;
    a {
      color: #fff;
    }
  }
`;
const ListsContainer = styled("div")`
  width: 100%;
  display: flex;
  justify-content: space-between;
  @media (max-width: 990px) {
    width: 80%;
    flex-wrap: wrap;
    justify-content: center;
  }
  @media (max-width: 460px) {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
`;
const BtnContainer = styled("div")`
  display: flex;
`;
const BtnClear = styled(Button)`
  background: #1d1d1d;
  color: #f5af27;
  width: 175px;
  border-radius: 0;
  &:hover {
    background: #fff;
    color: #000;
  }
  @media (max-width: 990px) {
    height: 60px;
  }
`;
export type ArrType = {
  node: {
    id: string;
    name: string;
    slug: string;
    count: number;
    databaseId: number;
  };
}[];

const filterSelected = (selectedValues: string[], allValues: ArrType) => {
  return selectedValues.map((item) => {
    return allValues.find(
      ({ node: { databaseId } }) => databaseId === Number(item)
    );
  });
};
const useFilterFromQuery = (
  name: string,
  allValues: ArrType,
  queryConfig: typeof ArrayParam
): [ArrType, (newValues: ArrType) => void] => {
  const [valueFromQuery] = useQueryParam(name, queryConfig);
  const [values, setValue] = useState<ArrType>(
    filterSelected(valueFromQuery || [], allValues)
  );

  const setFilteredValue = (newValues: ArrType): void =>
    setValue(
      filterSelected(
        newValues.map((t) => `${t.node.databaseId}`),
        allValues
      )
    );

  return [values, setFilteredValue];
};

const checkUsaStates = (
  countriesId: number,
  arr: {
    node: {
      databaseId: number;
    };
  }[]
) => {
  return arr.find(({ node: { databaseId } }) => countriesId === databaseId);
};

export const Search: FC<{
  setParams: (value: ParamsType | null) => void;
  ShowAlphabet: boolean;
}> = ({ setParams, ShowAlphabet }) => {
  const { topicsList } = useTopicsQuery();
  const { countryList } = useCountryQuery();
  const { statesList } = useStatesQuery();
  const { locationList } = useLocationQuery();
  const { genderList } = useGenderQuery();

  const [letterFromQuery] = useQueryParam("by_letter");
  const [topics, setTopics] = useFilterFromQuery(
    "topics",
    topicsList,
    ArrayParam
  );
  const [countries, setCountries] = useFilterFromQuery(
    "countries",
    countryList,
    ArrayParam
  );
  const [states, setStates] = useFilterFromQuery(
    "states",
    statesList,
    ArrayParam
  );
  const [location, setLocation] = useFilterFromQuery(
    "location",
    locationList,
    ArrayParam
  );
  const [gender, setGender] = useFilterFromQuery(
    "gender",
    genderList,
    ArrayParam
  );

  const [letter, setLetter] = useState(letterFromQuery);
  const arrayToId = (arr: { node: { databaseId: number } }[]) => {
    return arr.map(({ node: { databaseId } }) => databaseId);
  };
  const getString = (allValues: ArrType, name: string) => {
    if (allValues.length === 0) {
      return [];
    } else {
      return allValues.map(
        ({ node: { databaseId } }) => `${name}=${databaseId}`
      );
    }
  };
  const queryArr = () => {
    const stringQuery = [
      ...getString(topics, "topics"),
      ...getString(ranges, "ranges"),
      ...getString(countries, "countries"),
      ...getString(states, "states"),
      ...getString(location, "location"),
      ...getString(gender, "gender"),
    ].join("&");
    return stringQuery;
  };
  const checkEmptyArray = (arr: ArrType) => {
    return arr.length > 0 ? true : false;
  };
  const navLetter = (l: string) => {
    return `/keynote-speakers/?by_letter=${l}${
      queryArr().trim().length === 0 ? "" : "&"
    }${queryArr()}`;
  };

  const navCustomQuery = (l = letterFromQuery) => {
    return (
      `${
        !l
          ? "/keynote-speakers/?"
          : `/keynote-speakers/?by_letter=${l}${
              queryArr().trim().length === 0 ? "" : "&"
            }`
      }` + queryArr()
    );
  };
  useEffect(() => {
    if (queryArr().length > 0) {
      setParams({
        gender: arrayToId(gender),
        location: arrayToId(location),
        states: arrayToId(states),
        countries: arrayToId(countries),
        ranges: arrayToId(ranges),
        topics: arrayToId(topics),
      });
    }
  }, []);

  return (
    <>
      <ContainerContentTop bg="#1d1d1d">
        <ContentRes>
          <ListsContainer>
            <CheckBoxList
              defaultValue={topics}
              valueCheck={topicsList}
              placeholder="Speaking Topics"
              setValue={setTopics}
            />
            <CheckBoxList
              defaultValue={ranges}
              valueCheck={rangeList}
              placeholder="All Fee Ranges"
              setValue={setRanges}
            />
            <CheckBoxList
              defaultValue={countries}
              valueCheck={countryList}
              placeholder="All Countries"
              setValue={setCountries}
            />
            {checkUsaStates(35, countries) && (
              <CheckBoxList
                defaultValue={states}
                valueCheck={statesList}
                placeholder="All States"
                setValue={setStates}
              />
            )}

            <CheckBoxList
              defaultValue={location}
              valueCheck={locationList}
              placeholder="Location"
              setValue={setLocation}
            />
            <CheckBoxList
              defaultValue={gender}
              valueCheck={genderList}
              placeholder="Gender"
              setValue={setGender}
            />
          </ListsContainer>
          <BtnContainer>
            <Btn
              variant="contained"
              onClick={() => {
                setParams({
                  gender: arrayToId(gender),
                  location: arrayToId(location),
                  states: arrayToId(states),
                  countries: arrayToId(countries),
                  ranges: arrayToId(ranges),
                  topics: arrayToId(topics),
                });
                navigate(`${navCustomQuery()}`);
              }}
            >
              Search
            </Btn>
            {letterFromQuery ||
            checkEmptyArray(topics) ||
            checkEmptyArray(states) ||
            checkEmptyArray(countries) ||
            checkEmptyArray(location) ||
            checkEmptyArray(gender) ? (
              <BtnClear
                onClick={() => {
                  setParams(null);
                  setTopics([]);
                  setCountries([]);
                  setStates([]);
                  setLocation([]);
                  setGender([]);
                  navigate(`?`);
                }}
                variant="contained"
              >
                x CLEAR ALL
              </BtnClear>
            ) : null}
          </BtnContainer>
        </ContentRes>
      </ContainerContentTop>
      {!ShowAlphabet && (
        <ContainerContentTop bg="#000">
          <ContentRes>
            <CustomUl>
              {letterFromQuery ? (
                <CustomLi>
                  <Link
                    onClick={() => {
                      setLetter("");
                    }}
                    to={navLetter("")}
                  >
                    ALL
                  </Link>
                </CustomLi>
              ) : null}
              {arr_EN.map((l, idx) => (
                <CustomLi key={idx} active={letterFromQuery === l}>
                  <Link
                    onClick={() => {
                      setLetter(l);
                    }}
                    to={navLetter(l)}
                  >
                    {l}
                  </Link>
                </CustomLi>
              ))}
            </CustomUl>
          </ContentRes>
        </ContainerContentTop>
      )}
    </>
  );
};
