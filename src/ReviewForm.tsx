import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Links from './Links';

interface ReviewFormProps {
  finishForm: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ finishForm }) => {
  const location = useLocation();
  const weaponId = location.pathname.split('/').pop();

  const [reviewData, setReviewData] = useState({
    name: '',
    rating: 0,
    content: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRatingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const rating = parseFloat(e.target.value) / 2;
    console.log(rating);
    setReviewData((prevData) => ({
      ...prevData,
      rating,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const sql = `INSERT INTO recenzja (IdBroni, NazwaProfilu, Ocena, Godzina, Data, Opis)
    VALUES ('${weaponId}', '${reviewData.name}', '${reviewData.rating * 10}', CURRENT_TIME, CURRENT_DATE, '${reviewData.content}');`;
  
    const url = Links.postURL;

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ sql }),
    });
  
    console.log('SQL POST query received:', response);
    if (response.ok) {
      console.log('Recenzja została pomyślnie wysłana!');
    } else {
      console.error('Błąd podczas wysyłania recenzji');
    }
  
    console.log('Dane recenzji do wysłania:', reviewData);
    finishForm();
  };
  


  const ratingOptions = Array.from({ length: 11 }, (_, i) => (
    <option key={i} value={i}>
      {i * 0.5}⭐
    </option>
  ));

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <label htmlFor="review-name">Nazwa Użytkownika:</label>
      <input
        type="text"
        id="review-name"
        name="name"
        value={reviewData.name}
        onChange={handleInputChange}
      />

      <label htmlFor="review-rating">Ocena:</label>
      <select
        className="review-rating"
        name="rating"
        value={reviewData.rating}
        onChange={handleRatingChange}
      >
        {ratingOptions}
      </select>

      <label htmlFor="review-content">Treść recenzji:</label>
      <textarea
        id="review-content"
        name="content"
        rows={5}
        value={reviewData.content}
        onChange={handleInputChange}
      ></textarea>

      <button type="submit">Dodaj recenzję</button>
    </form>
  );
};

export default ReviewForm;
