import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";
import { Exercise } from "../../app/types";
import { RootState } from "../../app/store";

export const exercisesAdapter = createEntityAdapter({
    selectId: (exercise: Exercise) => exercise.id,
});

export const fetchExercises = createAsyncThunk(
    "exercises/fetchExercises",
    async () => {
        return await fetch("http://localhost:8080/api/exercises", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
    }
);

export const getExercisesForDate = createAsyncThunk(
    "exercises/getExercisesForDate",
    async (selected_date: string) => {
        return await fetch(
            `http://localhost:8080/api/exercises/fetch/${selected_date}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((res) => res.json());
    }
);

export const addExcercise = createAsyncThunk(
    "exercises/addExcercise",
    async (newExercise: any) => {
        return await fetch(`http://localhost:8080/api/exercises/add`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newExercise),
        }).then((res) => {
            return res.json();
        });
    }
);

export const deleteExercise = createAsyncThunk(
    "exercises/deleteExcercise",
    async (id: number) => {
        return await fetch(`http://localhost:8080/api/exercises/delete/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            return res.json();
        });
    }
);

export const workoutsSlice = createSlice({
    name: "workouts",
    initialState: exercisesAdapter.getInitialState({ loading: true }),
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getExercisesForDate.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getExercisesForDate.fulfilled, (state, action) => {
            state.loading = false;
            exercisesAdapter.setAll(state, action.payload.data);
        });
        builder.addCase(addExcercise.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addExcercise.fulfilled, (state, action) => {
            state.loading = false;
            exercisesAdapter.addOne(state, action.payload.data);
        });
        builder.addCase(deleteExercise.fulfilled, (state, action) => {
            exercisesAdapter.removeOne(state, action.payload.data);
        });
    },
});

export const workoutsSelectors = exercisesAdapter.getSelectors(
    (state: RootState) => state.workouts
);

export default workoutsSlice.reducer;