import React from 'react';
import styled from 'styled-components';

const KontaktBanner = styled.section `
    display: flex;
    background-color: #DBDBDB;
    height: 400px;
    font-weight: bolder;
    font-size: 24px;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

export const KontaktOss = () => {
    return (
        <KontaktBanner>
            Kontakt oss på 69 99 00 00
        </KontaktBanner>
    )
};

export default KontaktOss;