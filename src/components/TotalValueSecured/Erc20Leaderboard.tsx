import { FC, ReactEventHandler, useCallback } from "react";
import { useTotalValueSecured } from "../../api/total-value-secured";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import { AmountBillionsUsdAnimated } from "../Amount";
import { BodyText, TextInter } from "../Texts";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";

const Erc20Leaderboard: FC = () => {
  const totalValueSecured = useTotalValueSecured();
  const onImageError = useCallback<ReactEventHandler<HTMLImageElement>>((e) => {
    (e.target as HTMLImageElement).src =
      "/leaderboard-images/question-mark-v2.svg";
  }, []);
  return (
    <WidgetBackground className="flex flex-col gap-y-4">
      <WidgetTitle>erc20 leaderboard</WidgetTitle>
      <ul
        className={`
          max-h-96 overflow-y-auto
          pr-2
          ${scrollbarStyles["styled-scrollbar"]}
        `}
      >
        {totalValueSecured !== undefined &&
          totalValueSecured.erc20Leaderboard.map((row) => (
            <li
              className="text-white flex justify-between items-center"
              key={row.name}
            >
              <div className="flex items-center">
                <img
                  className="w-8 h-8 rounded-full"
                  src={
                    row.imageUrl ?? "/leaderboard-images/question-mark-v2.svg"
                  }
                  alt="logo of an ERC20 token"
                  onError={onImageError}
                />
                <BodyText className="ml-2 truncate">{row.name}</BodyText>
              </div>
              <AmountBillionsUsdAnimated>
                {row.marketCap}
              </AmountBillionsUsdAnimated>
            </li>
          ))}
      </ul>
    </WidgetBackground>
  );
};

export default Erc20Leaderboard;
