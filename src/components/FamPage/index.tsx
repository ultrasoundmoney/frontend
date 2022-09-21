import type { FC } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import type { BaseFeePerGas } from "../../api/base-fee-per-gas";
import { useBaseFeePerGas } from "../../api/base-fee-per-gas";
import type { EthPriceStats } from "../../api/eth-price-stats";
import { useEthPriceStats } from "../../api/eth-price-stats";
import type { FamCount } from "../../api/fam-count";
import colors from "../../colors";
import { useFeatureFlags, FeatureFlagsContext } from "../../feature-flags";
import { formatZeroDecimals } from "../../format";
import { useAdminToken } from "../../hooks/use-admin-token";
import { useClientRefreshed } from "../../hooks/use-client-refreshed";
import AdminTools from "../AdminTools";
import BasicErrorBoundary from "../BasicErrorBoundary";
import JoinDiscordSection from "../Dashboard/JoinDiscordSection";
import HamburgerMenu from "../HamburgerMenu";
import HeaderGlow from "../HeaderGlow";
import MainTitle from "../MainTitle";
import LabelText from "../TextsNext/LabelText";
import QuantifyText from "../TextsNext/QuantifyText";
import SkeletonText from "../TextsNext/SkeletonText";
import PriceGasWidget from "../TopBar/PriceGasWidget";
import WearTheBatSignal from "../WearTheBatSignal";
import PoapSection from "./PoapSection";

const FamPage: FC<{
  baseFeePerGas: BaseFeePerGas;
  ethPriceStats: EthPriceStats;
  famCount: FamCount;
}> = ({ baseFeePerGas, ethPriceStats, famCount }) => {
  const adminToken = useAdminToken();
  const { featureFlags, setFlag } = useFeatureFlags();

  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      <SkeletonTheme
        baseColor={colors.slateus500}
        highlightColor={"#565b7f"}
        enableAnimation={true}
      >
        <div className="container mx-auto md:px-16">
          {adminToken && (
            <BasicErrorBoundary>
              <AdminTools setFlag={setFlag} />
            </BasicErrorBoundary>
          )}
          <HeaderGlow />
          <div className="flex p-4 items-center justify-between z-10">
            <PriceGasWidget
              initialBaseFeePerGas={baseFeePerGas.wei}
              initialEthPrice={ethPriceStats.usd}
            />
            <HamburgerMenu />
          </div>
          <MainTitle className="mt-8">ultra sound fam</MainTitle>
          <BasicErrorBoundary>
            <section className="flex flex-col gap-y-4 mt-16">
              <div className="bg-slateus-700 p-8 flex flex-col gap-y-4 rounded-lg">
                <LabelText>fam count</LabelText>
                <div className="flex gap-x-1">
                  <QuantifyText className="text-3xl">
                    <SkeletonText width="90px">
                      {famCount === undefined
                        ? undefined
                        : formatZeroDecimals(famCount.count)}
                    </SkeletonText>
                  </QuantifyText>
                  <QuantifyText className="text-3xl text-slateus-400 ml-2">
                    members
                  </QuantifyText>
                </div>
              </div>
              <WearTheBatSignal />
            </section>
          </BasicErrorBoundary>
          <BasicErrorBoundary>
            <PoapSection />
          </BasicErrorBoundary>
          {/* <BasicErrorBoundary> */}
          {/*   <JoinDiscordSection /> */}
          {/* </BasicErrorBoundary> */}
        </div>
      </SkeletonTheme>
    </FeatureFlagsContext.Provider>
  );
};

export default FamPage;
