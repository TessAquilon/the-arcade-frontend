/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Grid, Loading, Card, Row, Text, Container, Pagination, Dropdown, Button } from '@nextui-org/react';
import { API_URL } from 'utils/urls';
import { useParams, Link } from 'react-router-dom';
import defaultImg from '../assets/img/-logos_transparent.png';
import Header from './Header';

const GamesList = () => {
  // Fetch the games from the API when the component mounts
  const [storedGames, setStoredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // Sort by name, rating, etc.
  // For example, /games/genres/action?sortBy=rating
  const [sort, setSort] = useState('');
  const [genreQuery, setGenreQuery] = useState('');
  const [storedGenres, setStoredGenres] = useState([]);
  const PAGE_SIZE = 20;
  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Get the games from the API
        const response = await fetch(API_URL(`games?genre=${genreQuery}&sort=${sort}&page=${currentPage}`));
        const data = await response.json();
        if (data.success) {
          const { games, total } = data.response;
          // Store the games in state
          setStoredGames(games);
          console.log(games);
          setTotalPages(Math.ceil(total / PAGE_SIZE))
        } else {
          console.log(data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGames();
  }, [genreQuery, sort, currentPage]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Get the genres from the API
        const response = await fetch(API_URL('/genres'));
        const data = await response.json();
        if (data.success) {
          const genres = data.response.map((genre) => ({ name: genre }));
          // Store the genres in state
          setStoredGenres(genres);
        } else {
          console.log(data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGenres();
  }, []);

  const handleGenre = (genreOption) => {
    setGenreQuery(genreOption);
  };

  const handleSort = (sortOption) => {
    setSort(sortOption);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClearSelection = () => {
    setGenreQuery('');
    setSort('');
  };

  return (
    <>
      <Header />
      <Container md>
        <Text
          h2
          css={{ fontFamily: '$body', color: '$black' }}>Games
        </Text>
        <Card css={{ borderRadius: '$xs' }}>
          <Card.Body css={{ p: 0, backgroundColor: '#f5e6fe' }}>
            <Row wrap="wrap" align="center">
              <Text css={{ fontWeight: '300', padding: '5px' }}>
                Browse and explore a wide range of exciting arcade games. Use the filters
                to narrow down your search by genre and release date. Click on a game card
                to view more details and immerse yourself in the world of arcade gaming.
              </Text>
            </Row>
          </Card.Body>
        </Card>
        <section style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <Dropdown isBordered>
            <Dropdown.Button
              auto
              color="success"
              css={{ borderRadius: '$xs' }}>
              {genreQuery === '' ? (<Text css={{ fontWeight: '500' }}>All genres</Text>) : (<Text>{genreQuery} games</Text>)}
            </Dropdown.Button>
            <Dropdown.Menu
              selectionMode="single"
              items={storedGenres}
              aria-label="game genres"
              variant="light">
              {(genre) => (
                <Dropdown.Item
                  withDivider
                  key={genre.name}>
                  <Button
                    type="button"
                    auto
                    ripple="false"
                    animated="false"
                    css={{ borderRadius: '$xs', color: '$black', backgroundColor: '$white' }}
                    onPress={() => handleGenre(genre.name)}>
                    {genre.name}
                  </Button>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown isBordered>
            <Dropdown.Button
              auto
              light
              css={{ borderRadius: '$xs' }}>
              {/* Display the current sort option based on what is stored as sort */}
              {sort === 'releasedAsce' && <Text>Oldest first</Text>}
              {sort === 'releasedDesc' && <Text>Newest first</Text>}
              {sort === '' && <Text>Sort by</Text>}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Sort by"
              variant="light">
              <Dropdown.Item>
                <Button
                  auto
                  type="button"
                  ripple="false"
                  animated="false"
                  css={{ borderRadius: '$xs', color: '$black', backgroundColor: '$white' }}
                  onPress={() => handleSort('releasedAsce')}>
                  Oldest first
                </Button>
              </Dropdown.Item>
              <Dropdown.Item
                withDivider>
                <Button
                  auto
                  type="button"
                  ripple="false"
                  animated="false"
                  css={{ borderRadius: '$xs', color: '$black', backgroundColor: '$white' }}
                  onPress={() => handleSort('releasedDesc')}>
                  Newest first
                </Button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </section>
        <section style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
          <Button
            auto
            flat
            color="error"
            css={{ borderRadius: '$xs' }}
            onPress={handleClearSelection}>
          Clear filters
          </Button>
        </section>
        <Grid.Container gap={1} justify="center" direction="row">
          {loading || storedGames === undefined ? (
            <Loading type="points" />
          ) : (
            storedGames.map((game, index) => (
            // eslint-disable-next-line no-underscore-dangle
              <Grid key={game._id}>
                <Link to={`/games/${game.slug}/${game._id}`}>
                  <Card isPressable css={{ w: '8rem', h: '15rem', borderRadius: '$xs' }}>
                    <Card.Body css={{ p: 0 }}>
                      {game.cover && game.cover.url ? (
                        <Card.Image
                          src={game.cover.url}
                          objectFit="cover"
                          width="100%"
                          height={140}
                          alt="image" />
                      ) : (
                        <Card.Image
                          src={defaultImg}
                          objectFit="contain"
                          width="100%"
                          height={140}
                          alt="image" />
                      )}
                      <Card.Footer css={{ justifyItems: 'flex-start' }}>
                        <Row wrap="wrap" align="center">
                          <Text>{game.name}</Text>
                          <Card.Divider />
                          {game.genres && game.genres.map((genre) => (
                            <Text
                              key={genre.id}
                              css={{ backgroundColor: '$purple200', fontSize: '$xs', fontWeight: '300', padding: '1px', marginTop: '$1', marginRight: '$1' }}>
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
          <Pagination total={totalPages} initialPage={currentPage} onChange={handlePageChange} css={{ marginTop: '30px' }} />
        </Grid.Container>
      </Container>
    </>
  );
}

export default GamesList;
