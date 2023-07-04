import React, { useCallback } from 'react';
import PromoRowItem from './PromoRowItem';
import { useUsers } from '../../services/queries/queries';

export default function PromoTwo() {
  const onSuccess = useCallback(data => {
    console.log('Success', data);
  }, []);

  const onError = useCallback(err => {
    console.log('Error', err);
  }, []);

  // const { isLoading, isFetching, data, refetch } = useArticles(
  //   onSuccess,
  //   onError
  // );

  const { isLoading, isFetching, data } = useUsers(onSuccess, onError);

  return (
    <section className="promo-section mt-5 ptb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-10">
            <div className="section-heading mb-5">
              <span className="text-uppercase color-secondary sub-title">Key features</span>
              <h2 className="mb-6">We Will Helps you to Build Beautiful Websites</h2>
            </div>
          </div>
        </div>
        {isLoading || isFetching ? (
          <div>Loading...</div>
        ) : (
          <div className="row">
            {Array.isArray(data?.data.data) &&
              data?.data.data.map((user, index) => (
                <PromoRowItem key={`promo-${index}`} first_name={user.first_name} email={user.email} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
