import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReservationForm from '../components/ReservationForm';
import CalendarForm from '../components/CalendarForm';
import { apiGet } from '../../restaurant/apis/apiInfo';
import Loading from '../../commons/components/Loading';
import { useTranslation } from 'react-i18next';

const ReservationContainer = ({ setPageTitle }) => {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({});
  const [times, setTimes] = useState([]);

  const { rstrId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet(rstrId);
        console.log(res);
        res.availableDates = res?.availableDates?.map((d) => new Date(d));
        if (!res.availableDates) {
          // 예약가능일이 없는 경우
          navigate('/restaurant/info/' + rstrId);
          return;
        }
        setData(res);
        setPageTitle(`${res.rstrNm} ${t('예약하기')}`);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [rstrId, setPageTitle, t]);

  const onCalendarClick = useCallback(
    (selected) => {
      const yoil = selected.getDay(); // 0(일) ~ 6(토)
      const { availableTimes } = data;

      for (const [k, times] of Object.entries(availableTimes)) {
        if (
          k === '매일' ||
          (k === '평일' && yoil > 0 && yoil < 6) ||
          (k === '토요일' && yoil === 6) ||
          (k === '일요일' && yoil === 7) ||
          (k === '주말' && (yoil === 6 || yoil === 0))
        ) {
          setForm((form) => ({ ...form, rDate: selected })); // date-fns // 날짜 형식화 필요(yyyy-MM-dd)
          setTimes(times);
          break;
        }
      }
    },
    [data],
  );

  const onTimeClick = useCallback((rTime) => {
    setForm((form) => ({ ...form, rTime }));
  }, []);

  const onChange = useCallback((e) => {
    setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
  }, []);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  if (!data) {
    return <Loading />;
  }

  return (
    <div>
      <CalendarForm
        availableDates={data.availableDates}
        onClick={onCalendarClick}
      />
      <ReservationForm
        data={data}
        form={form}
        times={times}
        onCalendarClick={onCalendarClick}
        onTimeClick={onTimeClick}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default React.memo(ReservationContainer);
