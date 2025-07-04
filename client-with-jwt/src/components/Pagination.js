import styled from "styled-components";

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <PageButton
          key={num}
          active={currentPage === num}
          onClick={() => onPageChange(num)}
        >
          {num}
        </PageButton>
      ))}
    </div>
  );
}

const PageButton = styled.button`
  margin: 0 4px;
  padding: 6px 12px;
  background-color: ${({ active }) => (active ? "#8884d8" : "#f0f0f0")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;


export default Pagination;