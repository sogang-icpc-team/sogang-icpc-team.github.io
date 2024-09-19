import { useState } from "react";
import { styled } from "styled-components";

import { OpenInANewTab } from "@ui/open-in-a-new-tab";
import { Modal } from "@ui/modal/modal";
import { Table } from "@ui/table/table";
import { OpenInANewTabButton } from "@ui/button/open-in-a-new-tab-button";
import { Button } from "@ui/button/button";

import { TSelectedHistoryContext } from "../../../app/history-page/contexts/selected-history-context";
const ReviewTable = styled(Table)`
  min-width: unset;
  margin-top: 12px;
`;
const LinksWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;
const ReviewLinkCell = styled(Table.Cell)`
  word-break: break-all;
`;

export const LinksAndReviews = ({
  className,
  links,
  review,
}: {
  className?: string;
  links: TSelectedHistoryContext["data"]["contests"][number]["links"];
  review: TSelectedHistoryContext["data"]["contests"][number]["review"];
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={className}>
      <LinksWrapper>
        {links.map((link) => {
          return (
            <OpenInANewTabButton key={link[1]} href={link[1]}>
              {link[0]}
            </OpenInANewTabButton>
          );
        })}
        {review.length > 0 ? (
          <Button onClick={() => setShowModal(true)}>대회 후기</Button>
        ) : null}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          header="대회 후기"
          body={
            <Table.Wrapper>
              <ReviewTable>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>작성자</Table.Head>
                    <Table.Head>링크</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {review.map((r) => (
                    <Table.Row key={r[0]}>
                      <Table.Cell>{r[0]}</Table.Cell>
                      <ReviewLinkCell>
                        <OpenInANewTab href={r[1]}>{r[1]}</OpenInANewTab>
                      </ReviewLinkCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </ReviewTable>
            </Table.Wrapper>
          }
          footer={<></>}
        />
      </LinksWrapper>
    </div>
  );
};
