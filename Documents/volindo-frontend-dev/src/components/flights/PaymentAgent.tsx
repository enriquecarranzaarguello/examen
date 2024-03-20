import { useTranslation } from 'react-i18next';
import { FlexboxGrid, InputGroup, Input, Form, Toggle } from 'rsuite';
import { usePrice } from 'src/components/utils/Price/Price';
import { PaymentAgentProposalFlightsProps } from '@typing/proptypes';

const PaymentAgent = ({
  flightTotalCost,
  subTotal,
  transactionFee,
  totalPrice,
  agentcommissionType,
  setAgentCommissionType,
}: PaymentAgentProposalFlightsProps) => {
  const { t } = useTranslation();
  const price = usePrice();
  return (
    <FlexboxGrid className="priceContainer flex flex-col gap-y-[5px] mb-2 w-full">
      <FlexboxGrid.Item className="w-full text-sm">
        <div className="flex justify-between items-center relative">
          <span className="text-white/[0.7] whitespace-nowrap">
            {t('flights.flight-cost')}
          </span>

          <FlexboxGrid.Item className="flex justify-end h-6  text-white border-none">
            {price.countrySymbol}
            {price.integerTotal(flightTotalCost)}
          </FlexboxGrid.Item>
        </div>
      </FlexboxGrid.Item>
      <FlexboxGrid className="w-full">
        <FlexboxGrid.Item className="w-full flex flex-col gap-[5px]">
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item>
              <span className="text-white/[0.7]">
                {t('flights.agent-subtotal')}
              </span>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item>
              <span className="flightSubTotal flex text-sm justify-center flex-col items-center">
                <span>
                  {price.countrySymbol} {price.integerWithOneDecimal(subTotal)}
                </span>
              </span>
            </FlexboxGrid.Item>
          </FlexboxGrid>

          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item>
              <span className="text-white/[0.7]">
                {t('flights.agent-trans')}
              </span>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item>
              <span className="TransactionFeeFlights flex text-sm justify-center flex-col items-center">
                <span>
                  {price.countrySymbol}{' '}
                  {price.integerWithOneDecimal(transactionFee)}
                </span>
              </span>
            </FlexboxGrid.Item>
          </FlexboxGrid>

          <FlexboxGrid align="middle" justify="space-between">
            <FlexboxGrid.Item>
              <span className="text-white/[0.7]">{t('flights.total')}</span>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <span className="FlightsTotal flex text-2xl justify-center flex-col items-cencter">
                <span>
                  {price.countrySymbol} {price.integerTotal(totalPrice)}
                </span>
              </span>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </FlexboxGrid.Item>

        <FlexboxGrid.Item className="w-full h-[40px] mt-[30px] bg-white/[.15] rounded-lg flex justify-around items-center">
          <FlexboxGrid>
            <FlexboxGrid.Item>
              <span>{t('flights.agent-com')}</span>
            </FlexboxGrid.Item>
          </FlexboxGrid>

          <FlexboxGrid>
            <FlexboxGrid.Item>
              <div className="flex gap-2 text-[12px]">
                <span>%</span>
                <Toggle
                  className="toggle-supplier"
                  size="sm"
                  checked={agentcommissionType === 'dollar'}
                  onChange={() =>
                    setAgentCommissionType(
                      agentcommissionType === 'percentage'
                        ? 'dollar'
                        : 'percentage'
                    )
                  }
                />
                <span>$</span>
              </div>
            </FlexboxGrid.Item>
          </FlexboxGrid>

          <FlexboxGrid>
            <FlexboxGrid.Item className="flex items-center">
              <InputGroup
                inside
                className="w-[110px!important] rounded-[90px!important] flex justify-start relative"
              >
                <span className="supplier_commission text-base mr-[5px] absolute text-black left-[10px] top-1/2 -translate-y-1/2 z-10">
                  {agentcommissionType === 'percentage' ? '%' : '$'}
                </span>
                <Form.Control
                  type="number"
                  placeholder="0"
                  name="commission"
                  className="w-[110px!important] h-[28px] rounded-[90px!important]"
                />
              </InputGroup>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </FlexboxGrid>
  );
};

export default PaymentAgent;
