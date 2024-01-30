import { useEffect, useState } from 'react';
import './App.css';
import { Link, useLocation } from 'react-router-dom';
import Links from './Links';

function roundAverageReview(average: number): number {
  const averageRating = average;
  const leftover = averageRating % 5;
  if (leftover > 2.5) {
    return averageRating + (5 - (averageRating % 5));
  } else {
    return averageRating - (averageRating % 5);
  }
}

/*
  Algorytm Levenisha do liczenia podobieństwa
*/
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      let cost = 0;
      if( str1[j - 1] === str2[i - 1]) {
        cost = 0;
      } else {
        cost = 1;
      }
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/*
Funkcja licząca podobieństwo w skali 0-1
*/
function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  const distance = levenshteinDistance(str1, str2);
  console.log(`comparing: ${str1} and ${str2}`);
  console.log(`maxLen: ${maxLength}`);
  console.log(`dystans: ${distance}`);
  const similarity = 1 - distance / maxLength;

  return similarity;
}

const SearchList = () => {
  const location = useLocation();
  const searchedKeyword = location.pathname.split('/').pop();

  const [searchIdList, setSearchIdList] = useState<{
    id: number;
    keyword: string;
  }[] | null>(null);

  const [filteredIdList, setFilteredIdList] = useState<{
    id: number;
    keyword: string;
  }[] | null>(null);

  const [weaponsData, setWeaponsData] = useState<{
    id: number;
    name: string;
    link: string;
    avgReview: number;
  }[] | null>(null);

  const [filteredWeapons, setFilteredWeapons] = useState<{
    id: number;
    name: string;
    link: string;
    avgReview: number;
  }[] | null>(null);

  const fetchData = async () => {
    try {
      const sql = `SELECT
        bron.IdBroni as id,
        bron.Nazwa as name,
        bron.LinkObrazka as link,
        AVG(recenzja.Ocena) AS avgReview
        FROM 
          bron
        LEFT JOIN 
          recenzja ON bron.IdBroni = recenzja.IdBroni
        GROUP BY 
          bron.IdBroni, bron.Nazwa, bron.LinkObrazka`;
      const url = `${Links.getURL}?sql=${encodeURIComponent(sql)}`;
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      let data = await response.json();

      setWeaponsData(data);
      console.log(weaponsData);

      return Promise.resolve();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSearch = async () => {
    if (searchedKeyword === undefined) {
      return null;
    }
  
    let sql = `SELECT IdBroni as id, SlowaKlucze as keyword FROM bron_slowaklucze`;
    const url = `${Links.getURL}?sql=${encodeURIComponent(sql)}`;
  
    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });
  
      const data: {id: number, keyword: string}[] = await response.json();
  
      setSearchIdList(data);
  
      const finalResult: {id: number, keyword: string}[] = [];
      if (data) {
        data.forEach(element => {
          console.log(element.keyword);
          const similarity = calculateSimilarity(element.keyword, searchedKeyword);
          console.log(similarity);
          if (similarity > 0.75) {
            finalResult.push(element);
          }
        });
        setFilteredIdList(finalResult);
      }
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
  };

  useEffect(() => {
    console.log("page is 'search'");
    fetchData();
    fetchSearch();
  }, [searchedKeyword]);

  useEffect(() => {
    if(weaponsData !== undefined && filteredIdList !== undefined && weaponsData !== null && filteredIdList !== null) {
      const finalList: {id: number,
        name: string,
        link: string,
        avgReview: number,}[] = [];
      for(let i = 0; i < filteredIdList.length; i++) {
        for(let j = 0; j < weaponsData.length; j++) {
          if(filteredIdList[i].id === weaponsData[j].id) {
            finalList.push(weaponsData[j]);
          }
        }
      }
      setFilteredWeapons(finalList);
    }
  }, [filteredIdList, weaponsData]);

  return (  
<div className="homepage">
      <div className="product-container">
        {filteredWeapons && filteredWeapons.length > 0 ? (
          filteredWeapons.map((weapon) => (
            <Link key={weapon.id} to={`/article/${weapon.id}`} className="product-preview-container" data-product-id={weapon.id}>
              <div>
                <label className="product-preview-label">{weapon.name}</label>
              </div>
              <div>
                <img className="product-preview-image" src={weapon.link} alt={`Preview of ${weapon.name}`} />
              </div>
              <div>
                <img className=""  src={`/images/rating-${roundAverageReview(weapon.avgReview)}.png`} alt={`Rating for ${weapon.name}`} />
              </div>
            </Link>
          ))
        ) : (
          <span className="noResults">Brak Wyników</span>
        )}
      </div>
    </div>
  );
}

export default SearchList;