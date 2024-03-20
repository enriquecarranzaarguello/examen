import { CancellationType } from '@typing/types';

interface CancellationChargesProps {
  cancellationCharges: CancellationType[];
  policyCase: Function;
}

const CancellationPolicyList = ({
  policyCase,
  cancellationCharges,
}: CancellationChargesProps) => {
  const reverseCharge = [...cancellationCharges].reverse();

  const handlePolicies = (reverseCharge: CancellationType[]) => {
    return reverseCharge.map((policy: CancellationType, index: number) => {
      const nextPolicy =
        index < reverseCharge.length - 1 ? reverseCharge[index + 1] : null;
      return <div key={index}>{policyCase(policy, nextPolicy)}</div>;
    });
  };
  return <>{handlePolicies(reverseCharge)}</>;
};

export default CancellationPolicyList;
