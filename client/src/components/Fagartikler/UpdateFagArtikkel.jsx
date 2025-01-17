import React, { useState, useEffect } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Banner from '../Banner.jsx';
import ModalCategory from './ModalCategory';
import { updateArticle, get } from '../../utils/articleService.js';
import { getCurrentUser } from '../../utils/loginService.js';
import { listCategories, createCategory } from '../../utils/categoryService.js';
import { listAuthors } from '../../utils/authorService.js';
import { uploadImage } from '../../utils/imageService';
import article from '../../../../server/models/article.js';

const Input = styled.input`
  border: 1px solid black;
  margin-bottom: 50px;
  height: 50px;
  border-radius: 7px;
  font-size: 16px;
`;

const Content = styled.textarea`
  border: 1px solid black;
  margin-bottom: 50px;
  height: 50px;
  border-radius: 7px;
  font-size: 16px;
`;

const Label = styled.label`
  font-weight: bolder;
  font-size: 18px;
  margin-bottom: 15px;
`;

const InputWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 0 auto;
  margin-top: 100px;
`;

const NyArtikkelButton = styled.button`
  display: flex;
  padding: 1.5rem 2.7rem;
  border: 0;
  width: 140px;
  font-weight: bold;
  font-size: 1, 8rem;
  max-height: 4rem;
  align-items: center;
  margin-right: 1.3rem;
  color: white;
`;

const CancleButton = styled.button`
  display: flex;
  padding: 1.5rem 2.7rem;
  border: 0;
  width: 140px;
  font-weight: bold;
  font-size: 1, 8rem;
  max-height: 4rem;
  align-items: center;
  margin-right: 1.3rem;
  color: white;
  background-color: #D14040;
`;

const ButtonContainer = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-space-around;
`;

const NewCategoryButton = styled.button`
  background-color: #469fb9;
  padding: 1rem 1rem;
  border: 0;
  height: 60px;
  width: 70px;
  font-weight: bold;
  font-size: 1rem;
  max-height: 4rem;
  color: white;
`;

const CategoryWrapper = styled.section`
  display: grid;
  grid-template-columns: 12fr 1fr;
  grid-gap: 30px;
  margin-bottom: 50px;
`;

const AuthorWrapper = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  height: 50px;
  margin-bottom: 30px;
`;

const SecretWrapper = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 2rem;
  grid-gap: 20px;
`;

const Error = styled.p`
  margin: 0;
  padding: 0;
  color: red;
  font-weight: bolder;
`;

export const UpdateFagArtikkel = ({ history }) => {
  const toDay = new Date();
  const formattedDate = `${toDay.getDate()}.${
    toDay.getMonth() + 1
  }.${toDay.getFullYear()}`;
  const [adminId, setAdminId] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    ingress: '',
    content: '',
    date: formattedDate,
    category: '',
    author: '',
    administrator: adminId,
  });

  const { id } = useParams();
  const [state, setState] = useState(false);
  const [category, setCategory] = useState();
  const [author, setAuthor] = useState();
  const [error, setError] = useState(null);
  const [modalCategory, setModalCategory] = useState();
  const [secret, setSecret] = useState(false);
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  /** LÅNT REGEX FRA FORELESERS EKSEMPEL PÅ FILEFILTER */
  const fileTypes = /\.(jpeg|jpg|png)$/;

  /** GJENBRUK FRA FORELESERS EKSEMPLER */
  const updateValue = (event) => {
    const inputValue = { [event.target.name]: event.target.value };
    setFormData((prev) => ({
      ...prev,
      ...inputValue,
    }));
  };

  /** LÅNT KODE FRA:  https://goshakkk.name/instant-form-fields-validation-react/
   * Lager et objekt som skal validere hvert felt, hvert felt er i utgangspunktet
   * true, når lengden på feltet blir over null blir den false og blir valid (litt reverse logikk)
   */
  const validateInput = (title, ingress, content, category, author) => ({
    title: title.length === 0,
    ingress: ingress.length === 0,
    content: content.length === 0,
    category: category.length === 0,
    author: author.length === 0,
  });

  /** LÅNT KODE FRA:  https://goshakkk.name/instant-form-fields-validation-react/
   * Funksjon som itererer over feltene i formData, hvis noen av feletene er true
   * er button disabled, om alle er false blir button enabled
   */
  const isValid = () => {
    const errors = validateInput(
      formData.title,
      formData.ingress,
      formData.content,
      formData.category,
      formData.author
    );
    const isDisabled = Object.keys(errors).some((i) => errors[i]);

    return !isDisabled;
  };

  /** LÅNT KODE FRA:  https://goshakkk.name/instant-form-fields-validation-react/ */
  const errors = validateInput(
    formData.title,
    formData.ingress,
    formData.content,
    formData.category,
    formData.author
  );

  /** LÅNT KODE FRA:  https://goshakkk.name/instant-form-fields-validation-react/ */
  const isDisabled = Object.keys(errors).some((i) => errors[i]);

  /** GENERERT KODE FRA https://fkhadra.github.io/react-toastify/introduction/#the-playground
   * Lager en toast som skal displayes hvis oppdatering av artikkel er suksess
   * @param {boolean} success
   */
  const notifyUpdateSuccess = (message) => {
    toast.success(`✅${message}`, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const update = async (articleId, inputData) => {
    const { data } = await updateArticle(articleId, inputData);
    console.log(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    /** LÅNT KODE FRA:  https://goshakkk.name/instant-form-fields-validation-react/ */
    if (!isValid) {
      return;
    }

    if (file && fileTypes.test(file.name)) {
      const { data } = await uploadImage(file);
      if (!data.success) {
        console.log(data.message);
        setError(data.message);
      } else {
        console.log('SE HER', data?.data?.id);
        setFileId(data?.data?.id);
        setError(null);
        const imdageId = data?.data?.id;
        const object = { secret, image: imdageId };
        update(id, { ...formData, ...object });
        notifyUpdateSuccess(`Artikkel: ${formData.title} oppdatert`);
      }
    } else {
      update(id, { ...formData, secret });
      notifyUpdateSuccess(`Artikkel: ${formData.title} oppdatert`);
      console.log(formData);
    }

    console.log('FORMDATA I SUBMIT', formData);
    setTimeout(() => {
      history.push('/fagartikler');
    }, 3000);
  };

  const showModal = (e) => {
    e.preventDefault();
    setState(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const categoryObject = {
      name: modalCategory,
    };
    createCategory(categoryObject);
    setState(false);
  };

  const handleCategoryChange = (e) => {
    setModalCategory(e.target.value);
    console.log(e.target.value);
  };

  const handleSecretTrue = (e) => {
    setSecret(!secret);
  };

  const closeModal = () => {
    setState(false);
  };

  const getAdminId = async () => {
    const { data } = await getCurrentUser();
    setAdminId(data.data._id);
    formData.administrator = data.data._id;
    console.log(data.data._id);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await get(id);
      if (data.success === false) {
        console.log(data);
        setError(data.success);
        console.log('fikk feil');
      } else {
        setFormData(data.dataArticle);
        console.log(data.category);
      }
    };

    const fetchCategories = async () => {
      const { data } = await listCategories();
      if (data.success === false) {
        console.log(data);
        setError(data.success);
        console.log('fikk feil');
      } else {
        setCategory(data);
      }
    };

    const fetchAuthors = async () => {
      const { data } = await listAuthors();
      if (data.success === false) {
        console.log(data);
        setError(data.success);
        console.log('fikk feil');
      } else {
        setAuthor(data);
      }
    };

    fetchArticle();
    fetchAuthors();
    fetchCategories();
    getAdminId();
  }, []);

  useEffect(() => {}, []);

  return (
    <>
      <Banner title={`Oppdater: ${formData.title}`} />
      <InputWrapper onSubmit={handleSubmit} encType="multipart/form-data">
        <ModalCategory
          state={state}
          handleCategoryChange={handleCategoryChange}
          handleModalSubmit={handleModalSubmit}
          setModalOpen={closeModal}
        />
        <Label htmlFor="title">Tittel </Label>
        <Input
          className={
            errors.title
              ? 'error'
              : '' /** LÅNT KODE FRA:  https://goshakkk.name/instant-form-fields-validation-react/ */
          }
          type="text"
          name="title"
          autoComplete="off"
          onChange={updateValue}
          value={formData.title}
        />
        <Label htmlFor="ingress">Ingress </Label>
        <Input
          className={
            errors.ingress
              ? 'error'
              : '' /** LÅNT KODE FRA:  https://goshakkk.name/instant-form-fields-validation-react/ */
          }
          type="text"
          name="ingress"
          autoComplete="off"
          onChange={updateValue}
          value={formData.ingress}
        />
        <Label htmlFor="content">Innhold </Label>
        <Content
          className={
            errors.content
              ? 'error'
              : '' /** LÅNT KODE FRA:  https://goshakkk.name/instant-form-fields-validation-react/ */
          }
          type="text"
          name="content"
          autoComplete="off"
          onChange={updateValue}
          value={formData.content}
        />
        <Label htmlFor="date">Dato </Label>
        <Input type="text" name="date" value={formattedDate} readOnly />

        <Label htmlFor="category">Label for kategori </Label>
        <CategoryWrapper>
          <select
            className={
              errors.category
                ? 'error'
                : '' /** LÅNT KODE FRA:  https://goshakkk.name/instant-form-fields-validation-react/ */
            }
            name="category"
            onChange={updateValue}
          >
            {category &&
              category.map((categoryItem) => (
                <option key={categoryItem.id} value={categoryItem.id}>
                  {categoryItem.name}
                </option>
              ))}
          </select>
          <NewCategoryButton onClick={showModal}>NY</NewCategoryButton>
        </CategoryWrapper>

        <Label htmlFor="author">Label for forfatter </Label>
        <AuthorWrapper>
          <select
            className={
              errors.author
                ? 'error'
                : '' /** LÅNT KODE FRA:  https://goshakkk.name/instant-form-fields-validation-react/ */
            }
            name="author"
            onChange={updateValue}
          >
            {author &&
              author.map((authorItem) => (
                <option key={authorItem.id} value={authorItem.name}>
                  {authorItem.name}
                </option>
              ))}
          </select>
        </AuthorWrapper>
        <SecretWrapper>
          <p style={{ margin: 0 }}>
            Gjør usynlig for brukere som ikke er logget inn
          </p>
          <input
            style={{ margin: 0 }}
            type="checkbox"
            placeholder="Gjør hemmelig"
            onClick={handleSecretTrue}
          />
          <Label htmlFor="fileInput">
            Last opp artikkel bilde (Ikke påkrevd):
          </Label>
          <input
            type="file"
            name="fileInput"
            accept=".jpg, .jpeg, .png"
            onChange={(event) => {
              console.log(event.target.files);
              const imageFile = event.target.files[0];

              if (!fileTypes.test(imageFile.name)) {
                setError({
                  field: 'file',
                  message:
                    'Kun filer av typen .jpeg, .jpg og .png er tillat, velg annen fil ellers blir den ikke lastet opp',
                });
              } else {
                setError(null);
                setFile(imageFile);
              }
            }}
          />
          {error && error.field === 'file' ? (
            <Error>{error.message}</Error>
          ) : (
            <Error />
          )}
        </SecretWrapper>
        <ButtonContainer>
          <NyArtikkelButton
            style={{
              backgroundColor: !isDisabled ? '#53a5be' : '#DBDBDB',
            }}
            disabled={isDisabled}
          >
            LAGRE
          </NyArtikkelButton>
          <CancleButton
            onClick={(event) => {
              event.preventDefault();
              history.push(`/fagartikler/${id}`);
            }}
          >
            Avbryt
          </CancleButton>
        </ButtonContainer>
        {/** GENERERT KODE FRA https://fkhadra.github.io/react-toastify/introduction/#the-playground
         * Lager toastcontainer som brukes for å displaye toast på suksess
         * @param {boolean} success
         */}
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </InputWrapper>
    </>
  );
};

export default withRouter(UpdateFagArtikkel);
