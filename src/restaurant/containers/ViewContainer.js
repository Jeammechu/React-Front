import React, { useEffect, useState, useCallback} from 'react';
import Loading from '../../commons/components/Loading';
import styled from 'styled-components';
import { apiGet } from '../apis/apiInfo';
import { useParams } from 'react-router-dom';
import KakaoMap from '../../kakaoapi/KakaoMap';
import ItemImage from '../components/ItemImage'
import ItemDescription from '../components/ItemDescription';

const Wrapper = styled.div`
    display: flex;
    margin-bottom: 15px;
`;

const ViewContainer = ({setPageTitle}) => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mapOptions, setMapOptions] = useState({ height: '400px', zoom: 3});

    const { rstrId } = useParams();

    useEffect(() => {
        apiGet(rstrId)
            .then(item => {
                setPageTitle(item.rstrNm);
                setItem(item);
                    const position = { lat: item.rstrLa, lng: item.rstrLo};
                setMapOptions((opt) => {
                   const options = item.rstrLa 
                   ? {...opt, center: position, marker: position} 
                   : {...opt, address: item.rstrRdnmAdr};

                   return options;
                });
            });

            setLoading(false);
    }, [rstrId, setPageTitle]);

    const onShowImage = useCallback((imageUrl) => {
        console.log('이미지 주소', imageUrl);
    }, []);


    if (loading || !item) {
        return <Loading />;
    }

    return (
    <>
        <Wrapper>
            {item?.images?.length && (
                <ItemImage images={item.images} onClick={onShowImage}/>
            )}
            <ItemDescription item={item} />
        </Wrapper>
        <KakaoMap {...mapOptions} />
    </>
    );
};

export default React.memo(ViewContainer);