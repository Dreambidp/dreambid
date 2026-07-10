export const buildAuctionStatusUpdateQuery = () => `
  UPDATE properties
  SET status = CASE
    WHEN status = 'upcoming' AND auction_date <= $1 THEN 'expired'
    ELSE status
  END
  WHERE status = 'upcoming' AND auction_date <= $1
`;
