import { ChangeEventHandler, useCallback, useMemo, useState } from "react";

export default function useCheckDates({ dataList }: { dataList: any[] }) {
  const [checkList, setCheckList] = useState<string[]>([]);

  const allChecked = useMemo(() => {
    return (
      dataList.length >= 1 &&
      dataList.every((obj) => checkList.includes(obj.date))
    );
  }, [dataList, checkList]);

  const handleCheck: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { checked, value } }) => {
      if (checked) setCheckList((prev) => [...prev, value]);
      else setCheckList((prev) => prev.filter((id) => id !== value));
    },
    []
  );

  const handleCheckAll: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { checked } }) => {
      if (checked) setCheckList(dataList.map((obj) => obj.date));
      else setCheckList([]);
    },
    [dataList]
  );

  const reset = useCallback(() => setCheckList([]), []);

  return {
    checkList,
    setCheckList,
    allChecked,
    handleCheck,
    handleCheckAll,
    reset,
  };
}
