import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useUserState } from '../../context/UserProvider';
import { list } from '../../utils/articleService.js';
import Banner from '../Banner';
import Artikkel from './ArticleItem';

const PageContainer = styled.section`
  display: flex;
  justify-content: center;
`;

const SearchAndFilterContainer = styled.section`
  display: flex;
  justify-content: flex-end;
`;

const SearchAndFilterButton = styled.button`
  display: flex;
  background-color: lightgray;
  padding: 1.5rem 2.7rem;
  border: 0;
  font-weight: bold;
  font-size: 0.6rem;
  max-height: 4rem;
  align-items: center;
  margin-right: 1.3rem;
`;

const NyArtikkelContainer = styled.section`
  display: flex;
  justify-content: flex-start;
  width: 300px;
  margin-right: 400px;
`;

const NyArtikkelButton = styled.button`
  display: flex;
  background-color: #469fb9;
  padding: 1.5rem 2.7rem;
  border: 0;
  font-weight: bold;
  font-size: 0.6rem;
  max-height: 4rem;
  align-items: center;
  margin-right: 1.3rem;
  color: white;
`;

const MainPage = styled.section`
  display: grid;
  justify-content: center;
`;

const WholePage = styled.section`
  display: grid;
  justify-content: center;
`;

export const Fagartikler = ({ history }) => {
  const { isAdmin, isLoggedIn } = useUserState();
  const [articles, setArticles] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const source = axios.CancelToken.source();
    let mounted = true;
    const fetchArticles = async () => {
      if (mounted) {
        const { data, err } = await list(5, 2);
        if (data.success === false) {
          // console.log(data);
          setError(data.success);
          // console.log('fikk feil');
        } else {
          console.log(data.data);
          setArticles(data.data.data);
        }
      }
    };
    fetchArticles();

    return function cleanup() {
      mounted = false;
      source.cancel();
    };
  }, []);

  return (
    <>
      <Banner title="Fagartikler" />
      <WholePage>
        <PageContainer>
          <NyArtikkelContainer>
            {isAdmin && (
              <NyArtikkelButton onClick={() => history.push('/nyartikkel')}>
                NY ARTIKKEL
              </NyArtikkelButton>
            )}
          </NyArtikkelContainer>
          <SearchAndFilterContainer>
            <SearchAndFilterButton>SØK</SearchAndFilterButton>
            <SearchAndFilterButton>FILTER</SearchAndFilterButton>
          </SearchAndFilterContainer>
        </PageContainer>

        <MainPage>
          {error && <h1>{error}</h1>}
          {articles &&
            isLoggedIn &&
            articles.map((article) => (
              <Artikkel
                id={article.id}
                key={article.id}
                title={article.title}
                text={article.ingress}
                category={article.category.name}
              />
            ))}

          {articles &&
            !isLoggedIn &&
            articles.map((article) => (
              <>
                {!article.secret && (
                  <Artikkel
                    id={article.id}
                    key={article.id}
                    title={article.title}
                    text={article.ingress}
                    category={article.category.name}
                  />
                )}
              </>
            ))}
        </MainPage>
      </WholePage>
    </>
  );
};

export default withRouter(Fagartikler);
