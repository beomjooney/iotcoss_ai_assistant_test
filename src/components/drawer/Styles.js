import styled from 'styled-components';

export const SProf = styled.div`
  padding: 1% 4% 4% 4%;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  .rest-info {
    text-align: center;
    margin-bottom: 5%;
  }
  .profile-pic {
    width: 45%;
  }
  .delivery-table {
    table {
      width: 100%;
      text-align: center;
      font-size: 1.7em;
      tr {
        td {
          padding: 5%;
        }
      }
    }
  }
  .menu {
    table {
      table-layout: fixed;
      width: 100%;
      tr {
        border-top: 1px solid #272d2f;
        border-bottom: 1px solid #272d2f;
      }
      td {
        padding: 5%;
      }
      .price {
        text-align: right;
        font-size: 1.5em;
        font-weight: bold;
      }
    }
  }
`;
