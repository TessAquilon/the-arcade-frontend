/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-underscore-dangle */
import { Modal, Card, Text, Container, Button } from '@nextui-org/react';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { user } from '../reducers/user';

const Reviews = () => {
  const [review, setReview] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [editReviewId, setEditReviewId] = useState(null);

  const dispatch = useDispatch();

  // if accessToken is in local storage, set it to the store
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(user.actions.setAccessToken(accessToken));
    }
  }, [dispatch]);

  // get accessToken from store
  const accessToken = useSelector((store) => store.user.accessToken);
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        'https://the-arcade-backend-6426jh4m2a-no.a.run.app/reviews'
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data.response);
          if (data.success) {
            setReview(data.response);
          } else {
            console.log(data.message);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `https://the-arcade-backend-6426jh4m2a-no.a.run.app/games/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        // Remove the deleted review from the state
        setReview(review.filter((item) => item._id !== reviewId));
        console.log('Review deleted successfully');
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateReview = async (reviewId, reviewText) => {
    console.log(reviewId);
    console.log(reviewText);
    try {
      const response = await fetch(
        `https://the-arcade-backend-6426jh4m2a-no.a.run.app/games/reviews/${reviewId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken
          },
          body: JSON.stringify({ message: newReviewText })
        }
      );
      const data = await response.json();
      if (data.success) {
        // Update the review in the state
        // Find the index of the review in the state
        const reviewIndex = review.findIndex((item) => item._id === reviewId);
        if (reviewIndex !== -1) {
          // Create a new array with the updated review
          const updatedReview = [...review];
          updatedReview[reviewIndex].message = newReviewText;
          // Update the state with the new array
          setReview(updatedReview);
          console.log('Review updated successfully');
        }
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewEditSubmit = (reviewId, reviewText) => {
    updateReview(reviewId, reviewText);
    setShowReviewForm(false);
  };

  const showEditReviewModal = (reviewId) => {
    if (reviewId === editReviewId) {
      return (
        <Modal open onClose={() => setShowReviewForm(false)}>
          <p>Write your review here</p>
          <textarea
            type="text"
            placeholder="Write your review here"
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            required
          />
          <button type="button" onClick={() => setShowReviewForm(false)}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleReviewEditSubmit(reviewId, newReviewText)}
          >
            Update
          </button>
        </Modal>
      );
    }
    return null;
  };

  useEffect(() => {
    fetchReviews();
    // console.log(review);
  }, []);

  return (
    <Container display="flex">
      <Text>Reviews</Text>
      {review.map((item) => (
        <Card
          key={item._id}
          css={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {console.log(item)}
          <div>10/10</div>
          <Card.Body css={{ maxWidth: '40%', alignItems: 'baseline' }}>
            <Text size="$2xl">{item.user.username}</Text>
            <Text weight="bold">{item.message}</Text>
          </Card.Body>
          {item.user._id === localStorage.getItem('userId') ? (
            <Button.Group css={{ maxWidth: '40%' }} vertical>
              <Button type="button" onClick={() => deleteReview(item._id)}>
                Delete
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowReviewForm(true);
                  setEditReviewId(item._id);
                }}
              >
                Edit
              </Button>
            </Button.Group>
          ) : (
            <Button.Group css={{ maxWidth: '40%' }} vertical>
              <Button onClick={() => deleteReview(item._id)} disabled>
                Delete
              </Button>
              <Button
                onClick={() => {
                  setShowReviewForm(true);
                  setEditReviewId(item._id);
                }}
                disabled
              >
                Edit
              </Button>
            </Button.Group>
          )}

          {showReviewForm && showEditReviewModal(item._id)}
        </Card>
      ))}
    </Container>
  );
};

export default Reviews;
