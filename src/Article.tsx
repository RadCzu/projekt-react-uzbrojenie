import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

const Article = () => {
  const location = useLocation();
  const productId = location.pathname.split('/').pop();

  const [productData, setProductData] = useState<{
    id: number;
    name: string;
    link: string;
    description: string;
    avgReview: number;
  }[] | null>(null);

  const fetchData = async () => {
    try {
      const sql = `SELECT
        bron.IdBroni as id,
        bron.Nazwa as name,
        bron.LinkObrazka as link,
        bron.Opis as description,
        AVG(recenzja.Ocena) AS avgReview
        FROM 
          bron
        LEFT JOIN 
          recenzja ON bron.IdBroni = recenzja.IdBroni
        WHERE
          bron.IdBroni = ${productId}
        GROUP BY 
          bron.IdBroni, bron.Nazwa, bron.LinkObrazka, bron.Opis`;
      const url = `${Links.getURL}?sql=${encodeURIComponent(sql)}`;
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      let data = await response.json();

      setProductData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log(`page is article/${productId}`);
    fetchData();
  }, [productId]);

  return (
    <>
      {productId && productData !== null && productData[0] !== undefined ? (
        <div className="product-article-container homepage" data-product-id={productData[0].id}>
          <label className="product-article-label">{productData[0].name}</label>
          <img className="product-article-image" src={productData[0].link} alt={`Preview of ${productData[0].name}`} />
          <p className="product-article-description">{productData[0].description}</p>
          <div className="product-article-rating">
            <label>Średnia Ocena:</label>
            {productData[0].avgReview !== undefined && (
              <img src={`/images/rating-${roundAverageReview(productData[0].avgReview)}.png`} alt={`Rating for ${productData[0].name}`} />
            )}
          </div>
          <div className="keywords-list">
            <p>{/* Renderuj tutaj słowa kluczowe */}</p>
          </div>
          {/* Dodaj resztę elementów z oryginalnego kodu */}
          <div className="product-review-container">
            <div className="reviews-header">
              <p className="reviews-headline">Recenzje:</p>
              <button id="add-review-button" className="add-review">
                Dodaj Recenzję
              </button>
            </div>
            <div id="form-review-container">{/* Tutaj wstaw komponent z recenzjami */}</div>
          </div>
        </div>
      ) : (
        <div className="no-results-container">
          <p>Brak danych dla produktu o ID: {productId}</p>
        </div>
      )}
    </>
  );
};

export default Article;