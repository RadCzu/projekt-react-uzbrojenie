import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
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

const Home = () => {
  const [weaponsData, setWeaponsData] = useState<{
    id: number;
    name: string;
    link: string;
    avgReview: number;
  }[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("page is 'home'");

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

        return Promise.resolve();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage">
      <div className="product-container">
        {weaponsData && weaponsData.length > 0 ? (
          weaponsData.map((weapon) => (
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

export default Home;
