/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Row, Text, Loading, Container } from '@nextui-org/react';
import { API_URL } from 'utils/urls';
import defaultImg from '../assets/img/-logos_transparent.png';
// import { InnerWrapper, OuterWrapper } from './StyledComponents';

const GamesDisplay10 = () => {
  const [storedGames, setStoredGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the games from the API when the component mounts
  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Get the games from the API
        const response = await fetch(API_URL('games'));
        const data = await response.json();
        const getRandomGames = (games, count) => {
          const shuffled = games.slice().sort(() => 0.5 - Math.random());
          return shuffled.slice(0, count);
        };
        if (data.success) {
          const games = data.response.games;
          console.log('this is games from gamesDisplay: ', games);
          // Get 10 random games
          const randomGames = getRandomGames(games, 6);
          console.log('this is randomGames from gamesDisplay: ', randomGames);
          // Store the games in state
          setStoredGames(randomGames);
        } else {
          console.log(data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGames();
  }, []);

  return (
    <Container md>
      <Text h2 css={{ fontFamily: '$body', color: '$black' }}>
        Featured
      </Text>
      <Grid.Container gap={1} justify="center" direction="row">
        {loading ? (
          <Loading type="points" />
        ) : (
          storedGames.map((game, index) => (
            <Grid key={game._id}>
              <Link to={`/games/${game._id}`}>
                <Card
                  isPressable
                  css={{ w: '8rem', h: '15rem', borderRadius: '$xs' }}
                >
                  <Card.Body css={{ p: 0 }}>
                    {game.cover && game.cover.url ? (
                      <Card.Image
                        src={game.cover.url}
                        objectFit="cover"
                        width="100%"
                        height={140}
                        alt="image"
                      />
                    ) : (
                      <Card.Image
                        src={defaultImg}
                        objectFit="contain"
                        width="100%"
                        height={140}
                        alt="image"
                      />
                    )}
                    <Card.Footer css={{ justifyItems: 'flex-start' }}>
                      <Row wrap="wrap" align="center">
                        <Text css={{ lineHeight: '$base' }}>{game.name}</Text>
                        <Card.Divider />
                        {game.genres &&
                          game.genres.map((genre) => (
                            <Text
                              key={genre.id}
                              css={{
                                backgroundColor: '$purple200',
                                fontSize: '$xs',
                                fontWeight: '$bold',
                                margin: '$1'
                              }}
                            >
                              {genre.name} &nbsp;
                            </Text>
                          ))}
                      </Row>
                    </Card.Footer>
                  </Card.Body>
                </Card>
              </Link>
            </Grid>
          ))
        )}
      </Grid.Container>
    </Container>
  );
};

export default GamesDisplay10;
