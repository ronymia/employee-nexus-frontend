import {
  IPunchInInput,
  IPunchInResponse,
  IPunchOutInput,
  IPunchOutResponse,
} from "@/types/punchIn-punchOut.type";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const PUNCH_IN_MUTATION = gql`
  mutation PunchIn($punchInInput: PunchInInput!) {
    punchIn(punchInInput: $punchInInput) {
      success
      statusCode
      message
      data {
        id
        punchIn
        projectId
        workSiteId
      }
    }
  }
`;

export const usePunchInMutation = () => {
  const [punchIn, { data, loading, error }] = useMutation<
    { punchIn: IPunchInResponse },
    { punchInInput: IPunchInInput }
  >(PUNCH_IN_MUTATION);

  return { punchIn, data, loading, error };
};

const PUNCH_OUT_MUTATION = gql`
  mutation PunchOut($input: PunchOutInput!) {
    punchOut(punchOutInput: $input) {
      success
      statusCode
      message
      data {
        id
        punchOut
        workMinutes
        breakMinutes
      }
    }
  }
`;

export const usePunchOut = () => {
  const [punchOut, { data, loading, error }] = useMutation<
    { punchOut: IPunchOutResponse },
    { input: IPunchOutInput }
  >(PUNCH_OUT_MUTATION);

  return { punchOut, data, loading, error };
};
