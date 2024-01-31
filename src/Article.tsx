import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import Links from './Links';
import ReviewForm from './ReviewForm';

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

  const [keywords, setKeywords] = useState<{
    keyword: string;
  }[] | null>(null);

  const [reviews, setReviews] = useState<{
    rating: number;
    reviewerName: string;
    time: string;
    date: string;
    content: string;
  }[] | null>(null);

  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);

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

  const fetchKeywords = async (weaponId: number) => {
    const sql = `SELECT SlowaKlucze as keyword FROM Bron_SlowaKlucze WHERE IdBroni = ${weaponId}`;
    const url = `${Links.getURL}?sql=${encodeURIComponent(sql)}`;
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
  
    const result = await response.json();
    setKeywords(result);
  };

  const finishForm = () => {
    setIsReviewFormVisible(false);
  };

  
  const fetchReviews = async (weaponId: number) => {
    try {
      console.log("fetching reviews");
      const sql = `SELECT Ocena as rating, NazwaProfilu as reviewerName, Godzina as time, Data as date, Opis as content FROM recenzja WHERE IdBroni = ${weaponId}`;
      const url = `${Links.getURL}?sql=${encodeURIComponent(sql)}`;
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      let result: {
        rating: number,
        reviewerName: string,
        time: string,
        date: string,
        content: string,
      }[] = await response.json();
      
      if(result) {
        const newreviews = result.map((review) => ({
          ...review,
          date: review.date.split('T')[0],
        }));
        setReviews(newreviews);
      }

    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    console.log(`page is article/${productId}`);
    fetchData();
    if(productId){
      fetchKeywords(parseInt(productId));
      fetchReviews(parseInt(productId));
    }
  }, [productId]);

  useEffect(() => {
    console.log(`refreshing article/${productId}`);
    if(productId){
      fetchReviews(parseInt(productId));
    }
  }, [isReviewFormVisible]);

  return (
    <div className="article-container">
      {productId && productData !== null && productData[0] !== undefined ? (
        <>
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
              <p>
                {keywords !== null && keywords.length > 0 ? (
                  keywords.map((keyword, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && ', '}
                      <a href={`/search/${encodeURIComponent(keyword.keyword)}`}>{"#"+keyword.keyword}</a>
                    </React.Fragment>
                  ))
                ) : (
                  'Wczytuję...'
                )}
              </p>
            </div>
          </div>
          {!isReviewFormVisible ? (
          <div className="product-review-container">
            <div className="reviews-header">
              <p className="reviews-headline">Recenzje:</p>
              <button id="add-review-button" className="add-review" onClick={() => setIsReviewFormVisible(true)}>
                Dodaj Recenzję
              </button>
            </div>
            <div id="form-review-container">
              {reviews !== null && reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="review">
                    <div className="review-header">
                      <p className="reviewer-name">{review.reviewerName}</p>
                      <p className="review-time">{review.time + " " + review.date}</p>
                    </div>
                    <div className="review-rating">
                      <img src={`../images/rating-${review.rating}.png`} alt={`Rating for ${productData[0].name}`} />
                    </div>
                    <div className="review-content">
                      <p>{review.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Brak recenzji.</p>
              )}
            </div>
          </div>
          ): (
            <ReviewForm finishForm={finishForm} />
          )}
        </>
      ) : (
        <div className="no-results-container">
          <p>Brak danych dla produktu o ID: {productId}</p>
        </div>
      )}
    </div>
  );
};

export default Article;